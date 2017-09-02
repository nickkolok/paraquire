var paraquire = require("paraquire")(module);

var accessed = false;
try{
    var f = paraquire("./escalating-lib.js",{requiringJSON:false});
    console.log(f());
    accessed = true;
}catch(e){
}
if (accessed){
    throw new Error('Able to require forbidden JSON');
}
