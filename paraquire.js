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

var filecache = {};

function paraquire(request, permissions, parent) {
	var sandbox = {
		module: {},
		global:{},
	};

	vm.createContext(sandbox);

	sandbox.require = (function(_sandbox){
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
				//TODO: avoid parent
				return runFile(_request, parent, _sandbox);
			}

		};
	})(sandbox);


	if(permissions && permissions.sandbox) {
		for (var prop in permissions.sandbox) {
			sandbox[prop] = permissions.sandbox[prop];
		}
	}

	//var moduleFile = require.resolve(request);

	console.log(request);
//	console.log(parent);

	return runFile(request, parent, sandbox);
}

function runFile(request, parent, sandbox){
	var moduleFile = Module._resolveFilename(request, parent, false);

	if (!(moduleFile in filecache)){
		filecache[moduleFile] = fs.readFileSync(moduleFile, 'utf8')
	}
	var moduleContents = filecache[moduleFile];

	vm.runInContext(moduleContents,sandbox,{filename:moduleFile});

	return sandbox.module.exports;
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
