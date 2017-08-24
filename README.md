# paraquire - paranoidal require
**Don't trust libraries!**

## Introduction
When you are installing a npm package, `npm` downloads all dependencies of that package.
You couldn't be sure that none of the dependencies is malware.
Now you almost CAN.

### Installation:
```
npm install --save paraquire
```

### Usage
Instead of
```js
var lib = require('untrusted-lib');
```
just write in advance
```js
var paraquire = require('paraquire')(module);
```
and then
```js
var lib = paraquire('untrusted-lib');
```
And that's all, `untrusted-lib` will be in jail without access to built-in modules such as `fs` and even to some globals, e.g. `console`.

### Giving partial access
```js
var lib = paraquire('untrusted-lib',{
    builtin: {
        'http': true,
        'https': true,
    },
    sandbox: {
        console: console
    }
});
```
So, `untrusted-lib` will have access to built-in modules `http` and `https` (i.e. `untrusted-lib` can do `require(https)`, but cannot do `require('fs)`) and to global `console`.