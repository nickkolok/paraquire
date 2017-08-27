var stack = require('callsite');

function f () {
  //console.log();
  stack().forEach(function(site){
 /*
    console.log('  \033[36m%s\033[90m in %s:%d\033[0m'
      , site.getFunctionName() || 'anonymous'
      , site.getFileName()
      , site.getLineNumber());
*/
    if(!site.getFunction()){
        throw new Error();
    };
  });
}

module.exports = f;

f();