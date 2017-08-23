module.exports = function(){
    var fs = require('fs');
    return fs.stat(__dirname + 'main.js');
}