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
	const sandbox = {
		module: {},
		require: function(name, perms) {
			console.log('Requiring '+name);
			if (isBuiltin(name)){
				if (permissions && permissions.builtin && permissions.builtin[name]) {
					return require(name);
				} else {
					throw new Error('Not permitted to require builtin module \'' + name + '\'');
				}
			} // de-facto else
			if (isBinaryAddon(name)) {
				if (permissions.binaryAddons === 'all') {
					return require(name); // TODO: is the name resolved properly?
				} else {
					throw new Error('Not permitted to require binary addon \'' + name + '\'');
				}
			} else {
				return paraquire(name);
			}

		},
		console:console,
		global:{},
	};

	//var moduleFile = require.resolve(request);

	var moduleFile = Module._resolveFilename(request, parent, false);

	if (!(moduleFile in filecache)){
		filecache[moduleFile] = fs.readFileSync(moduleFile, 'utf8')
	}
	var moduleContents = filecache[moduleFile];

	vm.runInNewContext(moduleContents,sandbox,{filename:moduleFile});

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
