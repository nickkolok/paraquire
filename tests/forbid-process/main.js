var paraquire = require("paraquire")(module);
try{
    var f = paraquire("./lib-with-process.js");
    console.log(f());
}catch(e){
    console.log(e);
}