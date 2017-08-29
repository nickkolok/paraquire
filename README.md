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
So, `untrusted-lib` will have access to built-in modules `http` and `https` (i.e. `untrusted-lib` can do `require('https')`, but cannot do `require('fs')`) and to global `console`.

## Compatibility

`paraquire` run with full functionality on `NodeJS`:

* `0.11.1 - 8.4.0`

`paraquire` runs, but cannot protect from some threats on `NodeJS`:

* `0.9.2 - 0.11.0`

* `~0.8.14`

* `0.8.9 - 0.8.12`

Once more: `paraquire` runs on these versions.
If your application or library uses `paraquire`,
`paraquire` will not ruin your project's compatibility with old `NodeJS` versions.

`paraquire` was not tested on other `NodeJS` versions.

[paraquire on Travis CI](https://travis-ci.org/nickkolok/paraquire)