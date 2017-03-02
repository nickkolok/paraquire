const util = require('util');
const vm = require('vm');
const fs = require('fs');
const path = require('path');

// From: https://github.com/nodejs/node/issues/3307#issuecomment-185734608
function isBuiltin(module) {
	try {
		const resolved = require.resolve(module);
		return !resolved.includes(path.sep);
	} catch(e) {
		return false;
	}
}

function saferequire(modulename, permissions) {
	const sandbox = {
		module: {},
		require: function(name, perms) {
			console.log('Requiring '+name);
			if(isBuiltin(name)){
				if(permissions && permissions[name]) {
					return require(name);
				}
			} else {
				return saferequire(name);
			}
		},
		console:console,
		global:{},
	};

	var moduleFile = require.resolve(modulename);
	var moduleContents = fs.readFileSync(moduleFile, 'utf8');

	vm.runInNewContext(moduleContents,sandbox,{filename:moduleFile});

	return sandbox.module.exports;
}

/*
const MurmurHash3 = saferequire('imurmurhash');

var hashState = MurmurHash3('string');
console.log(hashState.result());

//saferequire('./evil-lib.js')()();

//var crypto = saferequire('crypto');
*/

var uniqueSlug = saferequire('unique-slug', {'crypto': true});

var randomSlug = uniqueSlug();
var fileSlug = uniqueSlug('/etc/passwd');

console.log(randomSlug,fileSlug);

saferequire('./lib-with-global-1');
