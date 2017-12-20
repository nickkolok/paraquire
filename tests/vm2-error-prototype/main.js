'use strict';
var paraquire = require("paraquire")(module);

var accessed = false;
try{
    var f = paraquire("./lib-with-process.js", {builtin:[],sandbox:{console:console}});
    console.log(f);
    accessed = true;
}catch(e){
    console.log('"Good" error while trying to escape through Error constructor');
    console.log(e);
}
if(accessed){
    throw new Error ('Able to access forbidden process');
}