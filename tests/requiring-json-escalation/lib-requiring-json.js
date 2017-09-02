module.exports = function(){
    return require('./test.json').accessed +  require('./folder/test.json').accessed;
}