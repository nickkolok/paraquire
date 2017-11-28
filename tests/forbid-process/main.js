var paraquire = require("paraquire")(module);

const tap = require('tap');

tap.throws(
	()=>{
		var f = paraquire("./lib-with-process.js");
		console.log(f());
	},
	'Able to access forbidden "process"'
);

tap.doesNotThrow(
	()=>{
		f = paraquire("./lib-with-process.js",{sandbox:{process:{argv:process.argv,env:{LC_ALL:0}}}});
		console.log(f());
	},
	'Unable to access permitted "process.argv"'
);

tap.doesNotThrow(
	()=>{
		f = paraquire("./lib-with-process.js",{sandbox:{process:process}});
		console.log(f());
	},
	'Unable to access permitted "process"'
);

tap.doesNotThrow(
	()=>{
		var f = paraquire("./lib-with-process.js",{process:["env","exit"]});
		var result = f();
	},
	'Unable to access partially permitted "process"'
);

var f = paraquire("./lib-with-process.js",{process:["env","exit"]});
var result = f();

tap.equal(
	result,
	"!!undefined",
	'Able to access forbidden "process.argv"'
);



tap.doesNotThrow(
	()=>{
		f = paraquire("./lib-with-process.js",{process:["argv","env"]});
		console.log(f());
	},
	'Unable to access permitted "process.argv"'
);


tap.doesNotThrow(
	()=>{
		f = paraquire("./lib-with-process.js",{process:["env","argv"]});
		console.log(f());
	},
	'Unable to access permitted "process.argv"'
);
