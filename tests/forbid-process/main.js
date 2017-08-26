var paraquire = require("paraquire")(module);

var accessed = false;
try{
    var f = paraquire("./lib-with-process.js");
    console.log(f());
    accessed = true;
}catch(e){
}
if (accessed){
    throw new Error('Able to access forbidden "process"');
}

accessed = false;
try{
    f = paraquire("./lib-with-process.js",{sandbox:{process:{argv:process.argv,env:{LC_ALL:0}}}});
    console.log(f());
    accessed = true;
}catch(e){
}
if (!accessed){
    throw new Error('Unable to access permitted "process.argv"');
}

accessed = false;
try{
    f = paraquire("./lib-with-process.js",{sandbox:{process:process}});
    console.log(f());
    accessed = true;
}catch(e){
}
if (!accessed){
    throw new Error('Unable to access permitted "process"');
}

var accessed = false;
try{
    var f = paraquire("./lib-with-process.js",{process:["env","exit"]});
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
    f = paraquire("./lib-with-process.js",{process:["argv","env"]});
    console.log(f());
    accessed = true;
}catch(e){
}
if (!accessed){
    throw new Error('Unable to access permitted "process.argv"');
}

accessed = false;
try{
    f = paraquire("./lib-with-process.js",{process:["env","argv"]});
    console.log(f());
    accessed = true;
}catch(e){
}
if (!accessed){
    throw new Error('Unable to access permitted "process.argv"');
}
