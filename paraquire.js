'use strict';
const t = require('./paraquire-tools.js');

var ownMainFileName = null, ownToolsFileName = null;
try{
	ownMainFileName  = __filename;
	ownToolsFileName = ownMainFileName.replace(/\.js$/,"-tools.js");
	console.log('Paraquire self-located in:');
	console.log('\t' + ownMainFileName );
	console.log('\t' + ownToolsFileName);
}catch(e){
	// __filename is not available
}

function generateRequire(_sandbox, permissions, moduleFile){
	return function(_request) {
		console.log('Requiring ' + _request);
		if (t.isBuiltin(_request)){
			if (permissions && permissions.builtin && permissions.builtin[_request]) {
				return require(_request);
			} else {
				throw new Error('Not permitted to require builtin module \'' + _request + '\'');
			}
		} // de-facto else
		if (t.isBinaryAddon(_request)) {
			if (permissions && permissions.binaryAddons === 'all') {
				//TODO: с этого места поподробнее, предусмотреть не только 'all'
				return require(_request); // TODO: is the name resolved properly?
			} else {
				throw new Error('Not permitted to require binary addon \'' + _request + '\'');
			}
		} else {
			//TODO: don't do this work every time, use closures
			var childFile = t.resolveChildRequest(moduleFile, _request);

			return runFile(childFile, _sandbox, permissions);
		}
	};
}


function paraquire(request, permissions, parent) {
	var sandbox = t.createSandbox();

	if(permissions && permissions.sandbox) {
		for (var prop in permissions.sandbox) {
			sandbox[prop] = permissions.sandbox[prop];
		}
	}

	var moduleFile = t.resolveModuleRequest(request, parent);

	return runFile(moduleFile, sandbox, permissions);
}

function runFile(moduleFile, sandbox, permissions){
	var moduleContents = t.getScript(moduleFile);

	var premodule = moduleContents.runInContext(sandbox);
	var returnedModule = {};
	premodule(
		generateRequire(sandbox, permissions, moduleFile),
		returnedModule
	);
	return returnedModule.exports;
}



/*
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
