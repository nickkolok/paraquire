module.exports = function(){
    var fs = require('fs');
    return fs.stat('main.js',function(){});
}