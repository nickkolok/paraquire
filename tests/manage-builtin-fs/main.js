var paraquire = require("paraquire")(module);
try{
    var f = paraquire("./lib-with-builtin-fs.js", {builtin:{fs:true}});
    f();
}catch(e){
    throw new Error ('Unable to access permitted builtin module "fs"');
}

var accessed = false;
try{
    var f = paraquire("./lib-with-builtin-fs.js");
    f();
    accessed = true;
}catch(e){
    if(accessed) {
        throw new Error ('Able to access forbidden builtin module "fs"');
    }
}

accessed = false;
try{
    var f = paraquire("./lib-with-builtin-fs.js", {builtin:{http:true}});
    f();
    accessed = true;
}catch(e){
    if(accessed) {
        throw new Error ('Able to access forbidden builtin module "fs", while only "http" is permitted');
    }
}

try{
    var f = paraquire("./lib-with-builtin-fs.js", {builtin:{fs:true, http:true}});
    f();
}catch(e){
    throw new Error ('Unable to access permitted builtin module "fs"');
}

