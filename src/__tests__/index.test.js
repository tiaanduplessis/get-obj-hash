import getObjHash from '../'

test('should be defined', () => {
  expect(getObjHash).toBeDefined()
  expect(typeof getObjHash).toBe('function')
})

test('should hash object using BLAKE2s', () => {
  expect(getObjHash({ foo: 'bar' }, 'blake2sHex')).toBe('09da64c8bf2f8d35f455427593f1cec83a2f5dc297b9bfe9564cd405cd8eedf7')
  expect(getObjHash({ foo: 'bar' })).toBe('09da64c8bf2f8d35f455427593f1cec83a2f5dc297b9bfe9564cd405cd8eedf7')
  expect(getObjHash(5)).toBe('9019e532fa6da4ab4ae2980b2102d79af81e5ccb481bdd6a3c9cdc0f10fe60ee')
  expect(getObjHash(true)).toBe('3aa997a5c6f560fe2ccb5bad11d985987a18bffe9b3b17524cb47a37f4a3bd14')
})

test('should hash object using BLAKE2b', () => {
  expect(getObjHash({ foo: 'bar' }, 'blake2bHex')).toBe('69ba2f27abe30569cdccad25b58ec54899e77032f765d703a1cd5adcb5dd1158e999ba8325d9c770bff17ae175c220842196a83441a8a146e7bfdc9309955ae6')
})
