var paraquire = require("paraquire")(module);

const tap = require('tap');

tap.doesNotThrow(
	()=> {
		var f = paraquire("./lib-with-builtin-fs.js", {builtin:{fs:true}});
		f();
	},
	'Unable to access permitted builtin module "fs"'
);

tap.throws(
	()=> {
		var f = paraquire("./lib-with-builtin-fs.js");
		f();
	},
    'Able to access forbidden builtin module "fs"'
);

tap.throws(
	()=> {
		var f = paraquire("./lib-with-builtin-fs.js", {builtin:{http:true}});
		f();
	},
	'Able to access forbidden builtin module "fs", while only "http" is permitted'
);


tap.doesNotThrow(
	()=> {
		var f = paraquire("./lib-with-builtin-fs.js", {builtin:{fs:true, http:true}});
		f();
	},
	'Unable to access permitted builtin module "fs"'
);

tap.throws(
	()=> {
		var f1 = paraquire("./lib-with-builtin-fs.js", {builtin:{fs:true}});
		var f2 = paraquire("./lib-with-builtin-fs.js", {builtin:{http:true}});
		f1();
		f2();
	},
	'Error in two cosequential paraquire calls with different permissions'
);

//Builtins as array

accessed = false;
try{
    var f = paraquire("./lib-with-builtin-fs.js", {builtin:['http']});
    f();
    accessed = true;
}catch(e){
    if(accessed) {
        throw new Error ('Able to access forbidden builtin module "fs", while only "http" is permitted');
    }
}

try{
    var f = paraquire("./lib-with-builtin-fs.js", {builtin:['fs', 'http']});
    f();
}catch(e){
    console.log(e);
    throw new Error ('Unable to access permitted builtin module "fs"');
}
