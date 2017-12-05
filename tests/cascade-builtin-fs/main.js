var paraquire = require("paraquire")(module);


var tap = require('tap');


tap.doesNotThrow(
	()=>{
		var f = paraquire("./lib-with-builtin-fs.js", {builtin:{fs:true}});
		f();
	},
	'Unable to access permitted builtin module "fs" (1)'
);

var f;
tap.throws(
	()=>{
		f = paraquire("./lib-with-builtin-fs.js");
		f();
	},
	'Able to access forbidden builtin module "fs" (2)' + 
		'\n' + f //+ '\n' + f()
		+ '\n' + (typeof f)
);

var f;
tap.throws(
	()=>{
		f = paraquire("./lib-with-builtin-fs-1.js");
		f();
	},
	'Able to access forbidden builtin module "fs"\n'+f//+'\n'+f()
);


tap.throws(
	()=>{
		var f = paraquire("./lib-with-builtin-fs-final.js");
		f();
	},
	'Able to access forbidden builtin module "fs" - straight final'
);

tap.throws(
	()=>{
		var f = paraquire("./lib-with-builtin-fs.js", {builtin:{http:true}});
		f();
	},
	'Able to access forbidden builtin module "fs", while only "http" is permitted'
);


tap.doesNotThrow(
	()=>{
		var f = paraquire("./lib-with-builtin-fs.js", {builtin:{fs:true, http:true}});
		f();
	},
	'Unable to access permitted builtin module "fs"'
);



var accessed1 = false;
tap.throws(
	()=>{
		var f1 = paraquire("./lib-with-builtin-fs.js", {builtin:{fs:true}});
		var f2 = paraquire("./lib-with-builtin-fs.js", {builtin:{http:true}});
		f1();
		accessed1 = true;
		f2();
	},
	'Error in two cosequential paraquire calls with different permissions'
);

tap.equals(accessed1,true,'Error in two cosequential paraquire calls with different permissions');

