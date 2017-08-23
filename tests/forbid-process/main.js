var paraquire = require("paraquire")(module);

var accessed = false;
try{
    var f = paraquire("./lib-with-process.js");
    console.log(f());
    accessed = true;
}catch(e){
}
if (accessed){
    throw new Error('Able to access forbidden "process"');
}
