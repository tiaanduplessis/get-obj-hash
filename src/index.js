import stringify from 'fast-stringify'
import blake from 'blakejs'
import isObj from 'nova-is-obj'

export default function getObjHash(obj, func = 'blake2sHex') {
	obj = isObj(obj) ? obj : {val: obj}
 return blake[func](stringify(obj))
}
