'use strict';
var paraquire = require("paraquire")(module);

var accessed = false;
try{
    var f = paraquire("./lib-with-child_process.js", {builtin:[]});
    f.magic();
    accessed = true;
}catch(e){
    console.log(e);
}
if(accessed){
    throw new Error ('Able to access forbidden builtin module "child_process"');
}