var paraquire = require("paraquire")(module);

var f;


if (process && process.version) {
    var parts = process.version.split('.');
    if (parts[0] === 'v0' && (
        ((1*parts[1]) <= 10) || process.version === 'v0.11.0')
    ) {
        console.log('/**********************  WARNING  ***********************/');
        console.log('/* Your NodeJS is too old, paraquire cannot protect it. */');
        console.log('/* Your application will run without full protection    */');
        console.log('/********************************************************/');
        return;
    }
}

var tap = require('tap');


tap.throws(
	()=>{
		f = paraquire('./lib-with-callsite.js',{sandbox:{console:console}});
	},
	"Unpermitted access to paraquire function through stack"
);

tap.throws(
	()=>{
		f = paraquire('./lib-with-callsite.js',{sandbox:{console:console}});
		f();
	},
	"Unpermitted access to paraquire function through stack"
);

tap.throws(
	()=>{
		f();
	},
	"Unpermitted access to paraquire function through stack"
);
