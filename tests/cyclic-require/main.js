var paraquire = require('paraquire')(module);

const tap = require('tap');

tap.doesNotThrow(
	()=>{
		var result = paraquire('./a.js');
		console.log(result);
	},
	'Cyclic'
);
