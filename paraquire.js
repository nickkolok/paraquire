const util = require('util');
const vm = require('vm');
const fs = require('fs');
const path = require('path');
const Module = require('module');

// From: https://github.com/nodejs/node/issues/3307#issuecomment-185734608
function isBuiltin(module) {
	try {
		const resolved = require.resolve(module);
		return !resolved.includes(path.sep);
	} catch(e) {
		return false;
	}
}

function isBinaryAddon(name) {
	return /\.node$/i.test(name);
}

var scriptcache = {};


function generateRequire(_sandbox, permissions, moduleFile){
	return function(_request) {
		console.log('Requiring ' + _request);
		if (isBuiltin(_request)){
			if (permissions && permissions.builtin && permissions.builtin[_request]) {
				return require(_request);
			} else {
				throw new Error('Not permitted to require builtin module \'' + _request + '\'');
			}
		} // de-facto else
		if (isBinaryAddon(_request)) {
			if (permissions && permissions.binaryAddons === 'all') {
				//TODO: с этого места поподробнее, предусмотреть не только 'all'
				return require(_request); // TODO: is the name resolved properly?
			} else {
				throw new Error('Not permitted to require binary addon \'' + _request + '\'');
			}
		} else {
			//TODO: don't do this work every time, use closures
			var dirname = path.dirname(moduleFile);
			var paths = Module._nodeModulePaths(dirname);
			paths.unshift(dirname);
			var parent = {
				paths: paths,
				id: moduleFile,
				filename: moduleFile,
			};
			console.log(parent.paths);
			console.log(Module._resolveLookupPaths(_request, parent));
			var childFile = Module._resolveFilename(_request, parent, false);

			return runFile(childFile, _sandbox, permissions);
		}
	};
}

function paraquire(request, permissions, parent) {
	var sandbox = {
		global:{},
	};

	vm.createContext(sandbox);

	if(permissions && permissions.sandbox) {
		for (var prop in permissions.sandbox) {
			sandbox[prop] = permissions.sandbox[prop];
		}
	}

	//var moduleFile = require.resolve(request);

	console.log(request);
//	console.log(parent);

	var moduleFile = Module._resolveFilename(request, parent, false);

	return runFile(moduleFile, sandbox, permissions);
}

function runFile(moduleFile, sandbox, permissions){

	if (!(moduleFile in scriptcache)){
		scriptcache[moduleFile] = new vm.Script(
			"(function(require, module){" +
				fs.readFileSync(moduleFile, 'utf8') +
			"})",
			{filename:moduleFile}
		)
	}
	var moduleContents = scriptcache[moduleFile];

	var premodule = moduleContents.runInContext(sandbox);
	console.dir(premodule);
	var returnedModule = {};
	premodule(
		generateRequire(sandbox, permissions, moduleFile),
		returnedModule
	);
	return returnedModule.exports;
}

/*
const MurmurHash3 = paraquire('imurmurhash');

var hashState = MurmurHash3('string');
console.log(hashState.result());

//paraquire('./evil-lib.js')()();

//var crypto = paraquire('crypto');
*/
/*
var uniqueSlug = paraquire('unique-slug', {'crypto': true});

var randomSlug = uniqueSlug();
var fileSlug = uniqueSlug('/etc/passwd');

console.log(randomSlug,fileSlug);

paraquire('./lib-with-global-1');
*/


function generateParaquireByParent (parent) {
	return function(request, permissions) {
		return paraquire(request, permissions, parent);
	}
}

module.exports = generateParaquireByParent;
