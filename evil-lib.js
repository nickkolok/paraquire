'use strict';
module.exports = function() {
	//return new Function('(0,eval)(\'var fs = require("fs"); console.log(fs.stat)\');');
	//var fs = require("fs");
	//console.log(fs.stat);
	//(0,eval)('var fs = require("fs"); console.log(fs.stat)');
	return function(){
		var fs = require("fs");
		console.log(fs.stat);
	};
};
