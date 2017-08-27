'use strict';

var vm = require('vm');
var fs = require('fs');
var path = require('path');
var Module = require('module');

var scriptcache = {};
var   JSONcache = {};

function createSandbox(){
	return vm.createContext({
        global:{},
    });
}

function getJSON(moduleFile){
	if (!(moduleFile in JSONcache)){
		JSONcache[moduleFile] = JSON.parse(
			fs.readFileSync(moduleFile, 'utf8')
		);
	}
	return JSONcache[moduleFile];
}

function getScript(moduleFile){
	if (!(moduleFile in scriptcache)){
		scriptcache[moduleFile] = new vm.Script(
			"(function(require, module, exports){" +
				fs.readFileSync(moduleFile, 'utf8') +
			"})",
			{filename:moduleFile}
		);
	}
	return scriptcache[moduleFile];
}

function isBinaryAddon(name) {
	return /\.node$/i.test(name);
}

// From: https://github.com/nodejs/node/issues/3307#issuecomment-185734608
function isBuiltin(module) {
	try {
        console.log('Is "'+module+'" builtin?');
		var resolved = require.resolve(module);
        console.log('It resolves to ' + resolved);
        console.log('Seems to ' + !resolved.includes(path.sep));
        console.log('Typeof resolved is' + (typeof resolved));
		return resolved.indexOf(path.sep) === -1;
	} catch(e) {
        //console.log(e);
		return false;
	}
}

function isJSON(name) {
	return /\.JSON$/i.test(name);
}

function resolveChildRequest(moduleFile, _request){
    //console.log('resolveChildRequest(' + moduleFile + ',' + _request + ')');
	var dirname = path.dirname(moduleFile);
	var paths = Module._nodeModulePaths(dirname);
	//TODO: don't do this work every time, use closures
	paths.unshift(dirname);
	var parent = {
		paths: paths,
		id: moduleFile,
		filename: moduleFile,
	};
	return Module._resolveFilename(_request, parent, false);

}


var ownMainFileName = null, ownToolsFileName = null;
try{
	ownToolsFileName  = __filename;
	ownMainFileName = ownToolsFileName.replace(/\-tools\.js$/,".js");
	//console.log('Paraquire self-located in:');
	//console.log('\t' + ownMainFileName );
	//console.log('\t' + ownToolsFileName);
}catch(e){
	// __filename is not available
}

module.exports = {
    createSandbox: createSandbox,
    getJSON: getJSON,
    getScript: getScript,
    isBinaryAddon: isBinaryAddon,
    isBuiltin: isBuiltin,
    isJSON: isJSON,
    ownMainFileName: ownMainFileName,
    ownToolsFileName: ownToolsFileName,
    resolveChildRequest: resolveChildRequest,
}