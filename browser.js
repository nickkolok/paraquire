'use strict';
// https://github.com/substack/browserify-handbook#browser-field
function generateParaquireForBrowserify (parent, options) {
    if (!options) {
        console.log('/* You are using `paraquire` in a way which is incompatible with `browserify` */');
    }
	return function(request) {
		return options.require(request);
	}
}

module.exports = generateParaquireForBrowserify;
