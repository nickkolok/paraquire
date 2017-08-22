console.log("!", __filename);


var paraquire = require("paraquire");
try{
    var f = paraquire("./lib-with-process.js");
    f();
}catch(e){
    
}