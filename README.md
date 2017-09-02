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

## API

### Getting `paraquire` function
```js
var paraquire = require('paraquire')(module);
```
This should be written once per your file, preferably near the beginning of your file,
**before** calling `paraquire` function.
Don't forget about `(module)` after `require` call.
It could be a bit confusing,
but `paraquire` needs straight link to module which it is working with.

### Using `paraquire` function
Classic `require` function gets one argument: library that we are using.
Opposite of that, `paraquire` function gets two arguments:
library that we are using and permissions which we give to the library.
If the second argument is omitted, it is treated to be `{}`.
So, these pieces of code do the same:
```js
var paraquire = require('paraquire')(module);
var xtend = paraquire('xtend', {});
```
is equal to
```js
var paraquire = require('paraquire')(module);
var xtend = paraquire('xtend');
```
*(note: `xtend` is a very simple library which does not need any permissions)*

### Permissions options

#### `builtin`
list of builtin modules which the library can use.
Default: no access to builtin modules.
Could be written both as array:
```js
var ForeverAgent = paraquire('forever-agent', {builtin: ['http', 'https', 'util']})
```
or as object:
```js
var ForeverAgent = paraquire('forever-agent', {builtin: {
    http: true,
    https: true,
    util: true,
});
```
The latter is useful when you determine the permissions dynamically.
You can write `false` and the library will be to able to access that builtin.
These rights are the same as given above:
```js
var ForeverAgent = paraquire('forever-agent', {builtin: {
    fs: false,
    http: true,
    https: true,
    util: true,
});
```
*Tip: list builtins in alphabetical (lexical) order.*

#### `builtinErrors`
If `true`, an `Error` is thrown when the library tries to require a builtin module which it is not permitted to, otherwise **string with error message is returned**.
Defaults to `false`.
In most cases `false` is more useful.
Usually a library requires all essentive modules during initialization.
So that if we throw an `Error`, paraquired library could not initialize itself.
On the other hand, actual use of required builtins is often contained in functions,
i.e. if we do not call functions using forbidden builtin, we will not have an `Error` and
the library will be working without dangerous permissions.

##### Example
A third-part library - let's call it `fotoshock` - has four functions:

1. Read an image from local file.

2. Apply one of predefined filters to an image.

3. Write an image to a local file.

4. Post an image to instagram.

If we don't want to use the 4th piece of functionality, we simply do not give the `fotoshock` permissions to access `https`:
```js
var fotoshock = paraquire('fotoshock', {builtin: ['fs']});
```
If we call `fotoshock.postToInstagram()`, we would certainly get an error.
But while using other functions and while initializing no error will be thrown.

*Tip: make sure that you have good tests for your project ;-)*

#### `sandbox`
Object which will be `global` for the library.

*Tip: do not pass your own `global` unless heavily needed because of `global.process.binding('fs')`. Do not pass `process` for the same reason.*

##### Example
```js
var f = paraquire("lib-with-console", {sandbox: {process: fakeProcess, console: fakeConsole}});
```

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

## Paraquire CAN'T...

1. `paraquire` can't give you any warranty.

2. `paraquire` can't protect you from `preinstall` and `postinstall` scripts of `npm`.
Use `npm install --ignore-scripts`.
[Read more...](https://twitter.com/maybekatz/status/892501201551368192)

3. `paraquire` не может ограничить пакету Яровой доступ к `https` :-(