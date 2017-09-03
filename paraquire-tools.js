'use strict';

// {{ NodeJS <= 0.10 warning
    // In NodeJS <= 0.10 stack access limitation in strict mode
    // is not properly implemented
    // So, paraquire cannot protect from attacks through stack

    // Any help with adapting paraquire for Node <= 0.10 would be kindly appreciated
    // at github.com/nickkolok/paraquire or smth like that
    try {
        if (process && process.version) {
            var parts = process.version.split('.');
            if (parts[0] === 'v0' && (
                ((1*parts[1]) <= 10) || process.version === 'v0.11.0')
            ) {
                console.log('/**********************  WARNING  ***********************/');
                console.log('/* Your NodeJS is too old, paraquire cannot protect it. */');
                console.log('/* Your application will run without full protection    */');
                console.log('/********************************************************/');
            }
        }
    } catch(e) {
    }
// }} NodeJS <= 0.10 warning



var vm = require('vm');
var fs = require('fs');
var path = require('path');
var Module = require('module');

var scriptcache = {};
var   JSONcache = {};

function createSandbox(){
	var sandbox = vm.createContext({
        global:{},
    });

    // In NodeJS 8 console is unexpectedly accessible
    sandbox.console = null;

    // You should not do this, otherwise console gets back:
    // delete sandbox.console;

    return sandbox;

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
                stripShebang(
                    fs.readFileSync(moduleFile, 'utf8')
                ) +
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
		var resolved = require.resolve(module);
		return resolved.indexOf(path.sep) === -1;
	} catch(e) {
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


// Copied from https://github.com/nodejs/node/blob/67269fd7f33279699b1ae71225f3d738518c844c/lib/internal/module.js
/**
 * Find end of shebang line and slice it off
 */
function stripShebang(content) {
  // Remove shebang
  var contLen = content.length;
  if (contLen >= 2) {
    if (content.charCodeAt(0) === 35/*#*/ &&
        content.charCodeAt(1) === 33/*!*/) {
      if (contLen === 2) {
        // Exact match
        content = '';
      } else {
        // Find end of shebang line and slice it off
        var i = 2;
        for (; i < contLen; ++i) {
          var code = content.charCodeAt(i);
          if (code === 10/*\n*/ || code === 13/*\r*/)
            break;
        }
        if (i === contLen)
          content = '';
        else {
          // Note that this actually includes the newline character(s) in the
          // new output. This duplicates the behavior of the regular expression
          // that was previously used to replace the shebang line
          content = content.slice(i);
        }
      }
    }
  }
  return content;
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
//  getJSON: getJSON, // at this moment this is not needed, but who knows?
    getScript: getScript,
    isBinaryAddon: isBinaryAddon,
    isBuiltin: isBuiltin,
    isJSON: isJSON,
    ownMainFileName: ownMainFileName,
    ownToolsFileName: ownToolsFileName,
    resolveChildRequest: resolveChildRequest,
}