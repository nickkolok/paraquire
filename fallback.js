// This file is used as entry point

// It is needed because older Node versions does not support some techniques
// and it is unclear what to do with this

// Any help with adapting paraquire for Node <= 0.12 would be kindly appreciated
// at github.com/nickkolok/paraquire or smth like that

// Known points:
// 1. Lambdas are not supported
//
// 2. const in strict mode is not supported
//    !!! strict mode is obvious to have protection because of arguments.callee !!!
//
// 3. Builtin modules are not detected properly

(function(){
    // Original paraquire is a function which gets "module":
    // var paraquire = require('paraquire')(module);
    // So, we need to create a function to return which will fallback to usual require
    var fallbackRequire = function(){return require;};

    try {
        try{
            // Process may be undefined
            // For example, if we are inside other successful paraquire
            if(process.version[1]==='0'){
                // Now paraquire does not support Node <=0.12
                try{
                    // console may be undefined... khm, why?
                    // I don't know but I'm paranoid enough!
                    console.log('/**********************  WARNING  ***********************/');
                    console.log('/* Your NodeJS is too old, paraquire cannot protect it. */');
                    console.log('/* No rights management will be done.                   */');
                    console.log('/********************************************************/');
                    module.exports = fallbackRequire;
                    return;
                } catch(e){
                    // Trying to do our best
                    module.exports = fallbackRequire;
                    return;
                    // We can do nothing more
                }
            }
        } catch (e){
            // We don't know, what to do
        }
        module.exports = require('./paraquire.js');
        return;
    } catch (error) {
        // No, we shouldn't put it into a function because we want to return
        // We don't want to see gotos in security library, do we?
        try{
            // console may be undefined... khm, why?
            // I don't know but I'm paranoid enough!
            console.log('/**********************  WARNING  **********************/');
            console.log('/* Something went wrong, paraquire cannot protect you. */');
            console.log('/* No rights management will be done.                  */');
            console.log('/*******************************************************/');
            module.exports = fallbackRequire;
            return;
        } catch(e){
            // Trying to do our best
            module.exports = fallbackRequire;
            return;
            // We can do nothing more
        }
    }
})();