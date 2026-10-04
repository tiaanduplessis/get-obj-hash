
# get-obj-hash
[![package version](https://img.shields.io/npm/v/get-obj-hash.svg?style=flat-square)](https://npmjs.org/package/get-obj-hash)
[![package downloads](https://img.shields.io/npm/dm/get-obj-hash.svg?style=flat-square)](https://npmjs.org/package/get-obj-hash)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![package license](https://img.shields.io/npm/l/get-obj-hash.svg?style=flat-square)](https://npmjs.org/package/get-obj-hash)
[![make a pull request](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

> Get the hash of a object or primitive using BLAKE2b or BLAKE2s

## Table of Contents

- [get-obj-hash](#get-obj-hash)
    - [Table of Contents](#table-of-contents)
    - [Install](#install)
    - [Usage](#usage)
    - [Serialization and hash stability](#serialization-and-hash-stability)
    - [Contribute](#contribute)
    - [License](#license)

## Install

This project uses [node](https://nodejs.org) and [npm](https://www.npmjs.com). 

```sh
$ npm install get-obj-hash
$ # OR
$ yarn add get-obj-hash
```

## Usage

```js
import getObjHash from 'get-obj-hash'

console.log(getObjHash({ foo: 'bar' }, 'blake2bHex')) // 69ba2f27abe30569cdccad25b58ec54899e77032f765d703a1cd5adcb5dd1158e999ba8325d9c770bff17ae175c220842196a83441a8a146e7bfdc9309955ae6
console.log(getObjHash({foo: 'bar'})) // 09da64c8bf2f8d35f455427593f1cec83a2f5dc297b9bfe9564cd405cd8eedf7
console.log(getObjHash(5)) // 9019e532fa6da4ab4ae2980b2102d79af81e5ccb481bdd6a3c9cdc0f10fe60ee
console.log(getObjHash(true)) // 3aa997a5c6f560fe2ccb5bad11d985987a18bffe9b3b17524cb47a37f4a3bd14
```

Also useful for [keys in React](https://reactjs.org/docs/lists-and-keys.html#keys):

Changing an object's contents can change its hash and remount the component. Prefer a stable ID when an item's identity should survive edits.

```js
import React from 'react'
import getObjHash from 'get-obj-hash'

const Example = ({listOfObjects}) => 
    listOfObjects.map(current => 
        <div key={getObjHash(current)}>{current.name}</div>)

```

## Serialization and hash stability

`getObjHash(value, algorithm)` hashes the UTF-8 serialization produced by `fast-stringify`. The default algorithm is `blake2sHex` (64 hexadecimal characters); `blake2bHex` returns 128 hexadecimal characters.

The current behavior is:

- Objects whose `constructor` is `Object` are serialized directly. Other inputs are wrapped in `{ val: value }`, including primitives, arrays, dates, class instances, and objects with a null prototype. For example, `5` and `{ val: 5 }` have the same hash.
- Object keys are not sorted. Property enumeration order affects the serialized text, so `{ a: 1, b: 2 }` and `{ b: 2, a: 1 }` have different hashes. This is not a canonical object-equality hash.
- JSON serialization rules apply, including `toJSON`. Undefined, function, and symbol-valued object properties are omitted; those values in arrays and non-finite numbers become `null`. Distinct inputs can therefore serialize identically before hashing.
- Repeated references without cycles are serialized in full. Circular references use `fast-stringify` 1.x marker strings. For example, an object with `obj.self = obj` serializes as `{"self":"[ref-0]"}`. A literal object `{ self: '[ref-0]' }` has the same serialization and hash.
- Serialization errors propagate. For example, BigInt values and an unwrapped object's `toJSON` returning `undefined` cannot be hashed. Use the two algorithm names above; other names are not validated as supported algorithms.

A hash depends on the algorithm and the exact serialized text, not just the values an application considers equivalent. Changes to input order, `toJSON`, serialization dependencies, or runtime serialization behavior can change it. If hashes are persisted or used as cache keys, verify compatibility before upgrading, and plan how stored hashes will be migrated if the serialization changes. In particular, switching to `fast-stringify` 2.x changes circular-reference markers and therefore existing hashes for circular inputs.

## Contribute

Run `npm test -- --runInBand` after installing the development dependencies. The hash-stability tests contain fixed BLAKE2s and BLAKE2b vectors for the source, package main, and UMD CommonJS entry points. Treat a changed vector as a compatibility change to investigate, rather than automatically regenerating expected hashes. After rebuilding with `npm run build`, rerun the tests to check the generated entry points too.

1. Fork it and create your feature branch: `git checkout -b my-new-feature`
2. Commit your changes: `git commit -am "Add some feature"`
3. Push to the branch: `git push origin my-new-feature`
4. Submit a pull request

## License

MIT
