require = require('paraquire')(module, {require: require, inherit: true}) // eslint-disable-line no-global-assign
try{
    var f = require("./lib-with-builtin-fs.js", {builtin:{fs:true}});
    f();
}catch(e){
    console.log(e);
    throw new Error ('Unable to access permitted builtin module "fs"');
}

var accessed = false;
try{
    var f = require("./lib-with-builtin-fs.js", {});
    f();
    accessed = true;
}catch(e){
    if(accessed) {
        throw new Error ('Able to access forbidden builtin module "fs"');
    }
}

var accessed = false;
try{
    var f = require("./lib-with-builtin-fs.js");
    f();
    accessed = true;
}catch(e){
    console.log(e);
    throw new Error ('Unable to access permitted builtin module "fs"');
}

accessed = false;
try{
    var f = require("./lib-with-builtin-fs.js", {builtin:{http:true}});
    f();
    accessed = true;
}catch(e){
    if(accessed) {
        throw new Error ('Able to access forbidden builtin module "fs", while only "http" is permitted');
    }
}

try{
    var f = require("./lib-with-builtin-fs.js", {builtin:{fs:true, http:true}});
    f();
}catch(e){
    throw new Error ('Unable to access permitted builtin module "fs"');
}


var accessed1 = false;
var accessed2 = false;
try{
    var f1 = require("./lib-with-builtin-fs.js", {builtin:{fs:true}});
    var f2 = require("./lib-with-builtin-fs.js", {builtin:{http:true}});
    f1();
    accessed1 = true;
    f2();
    accessed2 = true;
}catch(e){
    if((!accessed1)|| (accessed2)) {
        throw new Error ('Error in two cosequential paraquire calls with different permissions');
    }
}
