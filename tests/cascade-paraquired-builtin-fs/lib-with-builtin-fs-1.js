const paraquire = require('paraquire')(module);

module.exports = function(){
    return paraquire('./lib-with-builtin-fs-final.js',{builtin:{fs:true}});
}