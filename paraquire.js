'use strict';
var t = require('./paraquire-tools.js');

function dbg(a,b,c){
	try {
		console.log(a,b,c);
	} catch (error) {
		// We can do nothing :-(
	}
}

function generateRequire(_sandbox, permissions, moduleFile, parent){
	if(!permissions){
		permissions = {};
	}
	// moduleFile is always full path to file
	// TODO: can "index.js" be omitted? I don't know
	// dbg("moduleFile in generateRequire: " + moduleFile);
	return function(_request) {
		//console.log('Requiring ' + _request);
		if (t.isBuiltin(_request)){
			if (permissions.builtin && permissions.builtin[_request]) {
				return require(_request);
			} else {
				if(permissions.builtinErrors){
					throw new Error(
						'Not permitted to require builtin module \'' + _request + '\'');
				}
				// Returning a string seems to be useful
				// Usually a library requires all essentive modules during initializations
				// So that if we throw an Error, paraquired library could not initialize
				// On the other hand,
				// actual use of required builtins is often contained in functions,
				// I.e. if we do not call functions using forbidden builtin,
				// we will not have an Error and
				// the library will be working without dangerous permissions.
				// Make sure that you have good tests for your project ;-)
				return 'Forbidden: ' + _request;
			}
		} // de-facto else
		if(t.isJSON(_request)){
			if(permissions.requiringJSON !== false){
				var childFile = t.resolveChildRequest(moduleFile, _request);
				return t.getJSON(childFile);
			} else {
				throw new Error("Not permitted to require JSON file '" + _request + "'");
			}
		} // de-facto else
		if (t.isBinaryAddon(_request)) {
			if (permissions.binaryAddons === 'all') {
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

	if(permissions) {
		if (permissions.builtin && permissions.builtin[0]) {
			//We cannot use instanceof Array or smth like this
			var builtinObj={};
			permissions.builtin.map(function(b){builtinObj[b]=true});
			permissions.builtin = builtinObj;
		}

		if(permissions.globals_s) {
			[
				'Buffer',
				'clearImmediate',
				'clearInterval',
				'clearTimeout',
				'setImmediate',
				'setInterval',
				'setTimeout',
			].map(function(g){sandbox[g] = sandbox.global[g] = global[g]});
		}

		if(permissions.sandbox) {
			for (var prop in permissions.sandbox) {
				sandbox[prop] = permissions.sandbox[prop];
			}
		} else {
			permissions.sandbox = {};
		}

		if(permissions.process){
			if(permissions.sandbox.process){
				throw new Error("Specifying both permissions.process and permissions.sandbox.process is forbidden");
			}
			sandbox.process={};
			permissions.process.map(function(b){sandbox.process[b]=process[b]});
		}
		if(permissions['process.env']){
			if(permissions.sandbox.process){
				throw new Error(
					"Specifying both permissions.process and permissions['process.env'] is forbidden"
				);
			}
			if(permissions.sandbox.process && permissions.sandbox.process.indexOf('env') !== -1){ //TODO: test
				throw new Error(
					"Specifying both permissions.process.env and permissions['process.env'] is forbidden"
				);
			}
			sandbox.process = sandbox.process || {};
			sandbox.process.env = {};
			permissions['process.env'].map(function(b){sandbox.process.env[b]=process.env[b]});
		}
		if(permissions.console){
			if(permissions.sandbox.console){
				throw new Error("Specifying both permissions.console and permissions.sandbox.console is forbidden");
			}
			if(permissions.console === true){
				sandbox.console=console;
			} else {
				sandbox.console={};				
				permissions.console.map(function(b){sandbox.console[b]=console[b]});
			}
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
	var returnedExports = {};
	var returnedModule = {
		exports: returnedExports,
		parent:parent,
		filename: moduleFile,
	};
	premodule(
		generateRequire(sandbox, permissions, moduleFile, returnedModule),
		returnedModule,
		returnedExports
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
