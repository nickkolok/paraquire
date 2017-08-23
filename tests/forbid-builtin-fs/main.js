//console.log("!", __filename);

//console.log(module);

//__filename = "";

var paraquire = require("paraquire")(module);
try{
    var f = paraquire("./lib-with-builtin-fs.js");
    f();
}catch(e){
    console.log(e);
}