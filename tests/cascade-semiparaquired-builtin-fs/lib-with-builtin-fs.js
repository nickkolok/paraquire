var paraquire = require('paraquire')(module);

var lib1 = paraquire('./lib-with-builtin-fs-1.js',{builtin:{fs:true}});

module.exports = function(){
    return lib1();
}