var paraquire = require("paraquire")(module);

const MurmurHash3 = paraquire('imurmurhash');

const tap = require('tap');

tap.doesNotThrow(
	()=>{
		var hashState = MurmurHash3('string').result();
	},
	'imurmurhash is unusable'
);

tap.equals(
	MurmurHash3('string').result(),
	2904652459,
	'imurmurhash is working bad :-('
);
