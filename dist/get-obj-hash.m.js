import o from"fast-stringify";import r from"blakejs";import t from"nova-is-obj";export default function(i,f){return void 0===f&&(f="blake2sHex"),i=t(i)?i:{val:i},r[f](o(i))}
