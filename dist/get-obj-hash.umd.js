!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t(require("fast-stringify"),require("blakejs"),require("nova-is-obj")):"function"==typeof define&&define.amd?define(["fast-stringify","blakejs","nova-is-obj"],t):e.getObjHash=t(e.stringify,e.blakejs,e.isObj)}(this,function(e,t,n){return e=e&&e.hasOwnProperty("default")?e.default:e,t=t&&t.hasOwnProperty("default")?t.default:t,n=n&&n.hasOwnProperty("default")?n.default:n,function(f,i){return void 0===i&&(i="blake2sHex"),f=n(f)?f:{val:f},t[i](e(f))}});
