console.log(this);
console.log(''+this.constructor);
console.log(''+Object.constructor);
console.log(this.constructor.constructor);
console.log(this.constructor.constructor("return process"));
var process = this.constructor.constructor("return process")();
module.exports = process.env;
