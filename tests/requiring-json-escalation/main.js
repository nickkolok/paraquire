var paraquire = require("paraquire")(module);

const tap = require('tap');

tap.throws(
	()=>{
		var f = paraquire("./escalating-lib.js",{requiringJSON:false});
		console.log(f());	
	},
	'Able to require forbidden JSON'
);
