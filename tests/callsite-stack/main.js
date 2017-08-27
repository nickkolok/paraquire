var paraquire = require("paraquire")(module);

var f;




var accessed = false;
try{
    f = paraquire('./lib-with-callsite.js',{sandbox:{console:console}});
    accessed = true;
}catch(e) {
}
if (accessed) {
    throw new Error("Unpermitted access to paraquire function through stack");
}

accessed = false;
try{
    f();
    accessed = true;
}catch(e) {
}
if (accessed) {
    throw new Error("Unpermitted access to paraquire function through stack");
}