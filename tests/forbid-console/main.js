console.log("!", __filename);

console.log(module);

//__filename = "";

var paraquire = require("paraquire");
try{
    var f = paraquire("./lib-with-console.js");
    f();
}catch(e){
    console.log(e);
}