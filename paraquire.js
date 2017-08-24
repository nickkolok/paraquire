'use strict';
const t = require('./paraquire-tools.js');

function dbg(a,b,c){
	try {
		console.log(a,b,c);
	} catch (error) {
		// We can do nothing :-(
	}
}

function generateRequire(_sandbox, permissions, moduleFile, parent){
	// moduleFile is always full path to file
	// TODO: can "index.js" be omitted? I don't know
	// dbg("moduleFile in generateRequire: " + moduleFile);
	return function(_request) {
		//console.log('Requiring ' + _request);
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
			//dbg(moduleFile, childFile, _request);
			//dbg(t.ownMainFileName, t.ownToolsFileName);
			if (
				moduleFile === t.ownMainFileName
			&&
				childFile === t.ownToolsFileName
			&&
				//TODO: unhardcode?
				_request === './paraquire-tools.js'
			){
				return t;
			}
			return runFile(childFile, _sandbox, permissions, parent);
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

//	dbg('parent in paraquire():');
//	dbg(parent);
//	dbg(parent.filename);
	var moduleFile = t.resolveChildRequest(parent.filename, request);

	return runFile(moduleFile, sandbox, permissions, parent);
}

function runFile(moduleFile, sandbox, permissions, parent){
	// moduleFile - full path to file which shoul be runned
	// sandbox - context in which the file should be runned
	// permissions - permissions object with which the file shoul be runned
	// parent - module which is parent to running file
	var moduleContents = t.getScript(moduleFile);

	var premodule = moduleContents.runInContext(sandbox);
	var returnedModule = {
		parent:parent,
		filename: moduleFile,
	};
	premodule(
		generateRequire(sandbox, permissions, moduleFile, returnedModule),
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
