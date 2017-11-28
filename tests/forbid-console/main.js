var paraquire = require("paraquire")(module);

const tap = require('tap');

tap.throws(
	()=>{
		var f = paraquire("./lib-with-console.js");
		f();
	},
	'Able to access forbidden "console"'
);

var accessed = false;
try{
    var f = paraquire("./lib-with-console.js",{sandbox:{console:console}});
    f();
    accessed = true;
}catch(e){
}
if (!accessed){
    throw new Error('Unable to access permitted "console"');
}

var accessed = false;
try{
    var f = paraquire("./lib-with-console.js", {console:true});
    f();
    accessed = true;
}catch(e){
}
if (!accessed){
    throw new Error('Unable to access permitted "console"');
}

var accessed = false;
try{
    var f = paraquire("./lib-with-console.js", {console:true,sandbox: {Array:Array}});
    f();
    accessed = true;
}catch(e){
}
if (!accessed){
    throw new Error('Unable to access permitted "console"');
}

var accessed = false;
try{
    var f = paraquire("./lib-with-console.js", {console:['log']});
    f();
    accessed = true;
}catch(e){
}
if (!accessed){
    throw new Error('Unable to access permitted "console.log"');
}

var accessed = false;
try{
    var f = paraquire("./lib-with-console.js", {console:['err', 'log']});
    f();
    accessed = true;
}catch(e){
}
if (!accessed){
    throw new Error('Unable to access permitted "console.log"');
}

var accessed = false;
try{
    var f = paraquire("./lib-with-console.js", {console:['err']});
    f();
    accessed = true;
}catch(e){
}
if (accessed){
    throw new Error('Able to access forbidden "console.log"');
}
