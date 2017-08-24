var paraquire = require("paraquire")(module);

const MurmurHash3 = paraquire('imurmurhash');

var accessed = false;
try{
    var hashState = MurmurHash3('string');
    accessed = true;
    if (hashState.result()!=2904652459) {
        throw new Error('imurmurhash is working bad :-(');
    }
}catch(e) {
    console.log(e);
    if(!accessed){
        throw new Error('imurmurhash is unusable');
    }
}
