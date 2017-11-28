var paraquire = require("paraquire")(module);

const tap = require('tap');

tap.throws(
	()=>{
		var f = paraquire("./lib-requiring-json.js",{requiringJSON:false});
		console.log(f());
	},
	'Able to require forbidden JSON'
);



accessed = false;
try{
    f = paraquire("./lib-requiring-json.js",{sandbox:{process:{argv:process.argv,env:{LC_ALL:0}}}});
    if(f()!=="truefolder"){
        throw f();
    }
    accessed = true;
}catch(e){
    console.log(e);
}
if (!accessed){
    throw new Error('Unable to require permitted JSON');
}

// And one more time the same
accessed = false;
try{
    f = paraquire("./lib-requiring-json.js",{sandbox:{process:{argv:process.argv,env:{LC_ALL:0}}}});
    if(f()!=="truefolder"){
        throw f();
    }
    accessed = true;
}catch(e){
    console.log(e);
}
if (!accessed){
    throw new Error('Unable to require permitted JSON');
}

accessed = false;
try{
    f = paraquire("./lib-requiring-json.js",{});
    if(f()!=="truefolder"){
        throw 0;
    }
    accessed = true;
}catch(e){
    console.log(e);
}
if (!accessed){
    throw new Error('Unable to require permitted JSON');
}

accessed = false;
try{
    f = paraquire("./lib-requiring-json.js");
    if(f()!=="truefolder"){
        throw 0;
    }
    accessed = true;
}catch(e){
    console.log(e);
}
if (!accessed){
    throw new Error('Unable to require permitted JSON');
}
