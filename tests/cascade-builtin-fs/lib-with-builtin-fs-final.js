module.exports = function(){
    var fs = require('fs');
    console.log('!!!!!!! Stats');
    console.log(fs.statSync('main.js'));
    fs.statSync('main.js');

    return fs.stat('main.js',function(){});
}
