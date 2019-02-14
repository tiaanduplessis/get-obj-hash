
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

```js
import React from 'react'
import getObjHash from 'get-obj-hash'

const Example = ({listOfObjects}) => 
    listOfObjects.map(current => 
        <div key={getObjHash(current)}>{current.name}</div>)

```

## Contribute

1. Fork it and create your feature branch: `git checkout -b my-new-feature`
2. Commit your changes: `git commit -am "Add some feature"`
3. Push to the branch: `git push origin my-new-feature`
4. Submit a pull request

## License

MIT
    