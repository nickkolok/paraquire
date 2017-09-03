#!/usr/bin/node

var paraquire = require("paraquire")(module);

var accessed = false;
try{
    var f = paraquire("./proxy-lib.js");
    console.log(f());
    accessed = true;
}catch(e){
}
if (accessed){
    throw new Error('Able to access forbidden "process"');
}

accessed = false;
try{
    f = paraquire("./proxy-lib.js",{sandbox:{process:{argv:process.argv,env:{LC_ALL:0}}}});
    console.log(f());
    accessed = true;
}catch(e){
    console.log(e);
}
if (!accessed){
    throw new Error('Unable to access permitted "process.argv"');
}

accessed = false;
try{
    f = paraquire("./proxy-lib.js",{sandbox:{process:process}});
    console.log(f());
    accessed = true;
}catch(e){
}
if (!accessed){
    throw new Error('Unable to access permitted "process"');
}

var accessed = false;
try{
    var f = paraquire("./proxy-lib.js",{process:["env","exit"]});
    var result = f();
    accessed = true;
}catch(e){
}
if (!accessed){
    throw new Error('Unable to access partially permitted "process"');
}
if(result!=="!!undefined"){
    throw new Error('Able to access forbidden "process.argv"');
}
accessed = false;
try{
    f = paraquire("./proxy-lib.js",{process:["argv","env"]});
    console.log(f());
    accessed = true;
}catch(e){
}
if (!accessed){
    throw new Error('Unable to access permitted "process.argv"');
}

accessed = false;
try{
    f = paraquire("./proxy-lib.js",{process:["env","argv"]});
    console.log(f());
    accessed = true;
}catch(e){
}
if (!accessed){
    throw new Error('Unable to access permitted "process.argv"');
}
