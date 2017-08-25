## Syntax
```js
var libname = paraquire('libname',{autoscan:true});
```
or
```js
var libname = paraquire('libname',{autoscan:true,builtin:{fs:false,http:true}});
```
## Description
* If `libname` is relative path or absolute path, i.e. starts with `./`, `../` or `/` or strict equals to `..` or `.`,
then regular `require` with all available permissions will be done.

* Otherwise, `libname` is supposed to be the package name and splitted by slashes `\` and `/`.

    * If `libname` starts with `@`, two first parts of name are supposed to be the package name.

    * Otherwise only the first part is.

When package name is known, the package location is resolved and `paraquire.json` from the package main folder file is readed and permission from that file are applied.

## Notice
1. The permissions can be redefined explicitly.
2. The permission format in `paraquire.json` is not strictly same with one using in code. For example, I don't know how to put in JSON the following:
```js
var libname = paraquire('libname', {
    sandbox: {
        process: {
            argv: process.argv,
            env: {LC_ALL: "UTF8"},
        }
    }
});
```
3. It could be a Babel plugin who puts the code below into beginning of each file:
```js
var paraquire = require('paraquire')(module);
var require = function(libname, perms) {
    perms.autoscan = true;
    return paraquire(libname, perms);
}
```
or smth like that (I haven't tested the code).