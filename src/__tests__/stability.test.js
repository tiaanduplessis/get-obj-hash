import getObjHash from '../'

// These fixed digests describe the existing fast-stringify 1.x serialization.
// Do not regenerate them automatically when updating dependencies.
const fixtures = [
  {
    name: 'plain object',
    make: () => ({ foo: 'bar' }),
    // Serialized input: {"foo":"bar"}
    blake2sHex: '09da64c8bf2f8d35f455427593f1cec83a2f5dc297b9bfe9564cd405cd8eedf7',
    blake2bHex: '69ba2f27abe30569cdccad25b58ec54899e77032f765d703a1cd5adcb5dd1158e999ba8325d9c770bff17ae175c220842196a83441a8a146e7bfdc9309955ae6'
  },
  {
    name: 'number wrapper',
    make: () => 5,
    // Serialized input: {"val":5}
    blake2sHex: '9019e532fa6da4ab4ae2980b2102d79af81e5ccb481bdd6a3c9cdc0f10fe60ee',
    blake2bHex: 'dfd9c02e332a59601f761e52d4b68e8f101f3609b123938fa8e358a8bb0fb8e9b485758f1e5190a78159082b6703f900a1b18f3d372fa77b8c2c61e1a0814ef9'
  },
  {
    name: 'boolean wrapper',
    make: () => true,
    // Serialized input: {"val":true}
    blake2sHex: '3aa997a5c6f560fe2ccb5bad11d985987a18bffe9b3b17524cb47a37f4a3bd14',
    blake2bHex: 'aab2da3417500333d8e9a9a518fecf133490b04daae275d582881f4625c550f40b0c629accc469ceabdf3556119c7a43fc2173cd0508a50f869c9b9561e90f17'
  },
  {
    name: 'null wrapper',
    make: () => null,
    // Serialized input: {"val":null}
    blake2sHex: '06b4701dc5987061c8f6e0769749b6c0d1378ae31a6bf2cbb6ee0f79b0d6284f',
    blake2bHex: 'b468efe726544a13f5dafaaa2472cb2c68fabd79269c28f4947bf27f84943ea012ac489ee7baef29d7b309964ce80f463cf882d087382d9130f47b7f1d78636d'
  },
  {
    name: 'undefined wrapper',
    make: () => undefined,
    // Serialized input: {}
    blake2sHex: 'c037b78fe4d5b8306d697512856dbcab4c636b35767a7502bf7abfd2cd5b43cd',
    blake2bHex: '9327a492264ecac0806b031b780241d86cabe38348fe49c4c5a610ee584cfbaaefd3fdffd1b1b54c9ee225820433a7f902c688b2e123181a56c73b9cbf9cd13f'
  },
  {
    name: 'array wrapper and null substitutions',
    make: () => [1, undefined, NaN],
    // Serialized input: {"val":[1,null,null]}
    blake2sHex: '290cdfaa21e16277d27cda3bd77c11423a349e3c0910a8b1443ab77a610654ea',
    blake2bHex: '91e3fee8e3870904a4c0963d36f0f610adf74e37c407d3bae6c063006c6ae30c3f5b32ea69b8bd660312be3f6405df06c7a485a3be1fc2eb0bbbf64f2b574164'
  },
  {
    name: 'nested Unicode value',
    make: () => ({ nested: { text: 'café 🚀' } }),
    // Serialized input: {"nested":{"text":"café 🚀"}}
    blake2sHex: '6e3f7c2a3fca7bc16c177b2ebec92164d10ae095703b7ec15093cbaa1aff1cdc',
    blake2bHex: '9599769a633a7960bd8c53d2291be06a466a9404aa87d1fb048ea3dc30d94090e8e78b5a3d58fbbc01e054adfbb2308866939f79b9177247abb48b767a3f9b9a'
  },
  {
    name: 'a then b insertion order',
    make: () => ({ a: 1, b: 2 }),
    // Serialized input: {"a":1,"b":2}
    blake2sHex: '42b0060d9a9f86574ff9b9f74a264569441bac2342d6c824011031cde9c4a2c4',
    blake2bHex: '48b67e39835c275935ecacf12236812a6582b4aaa75b2e553f37fac9e8c609fca86c4a22b8be7200246f9168a0d2ec7499f4ab3bd6cb612f1d187561cc86978b'
  },
  {
    name: 'b then a insertion order',
    make: () => ({ b: 2, a: 1 }),
    // Serialized input: {"b":2,"a":1}
    blake2sHex: '783654f89f35937f87aa6241363fa97ec90f51bf02d3e145635356d87fd36306',
    blake2bHex: '812fdb973961e0b85ac6aafc8f38f13623c4c395fa2448499c0bb8235de7d620886faf0871fa8c36e5c4e004bb18f6e574e09665e0e7f9dd913d2f1713b88dea'
  },
  {
    name: 'repeated reference without a cycle',
    make: () => {
      const child = { n: 1 }
      return { a: child, b: child }
    },
    // Serialized input: {"a":{"n":1},"b":{"n":1}}
    blake2sHex: 'c087ad2899d520b598047328a7223ed7ad7359e9ece55ac8e3b341c496588933',
    blake2bHex: '52a36c34c981c7307bac39d88c7c69c8610f67d5f9dae6acfdc1d4762657e5ce8e6b6287380c4d18f1026c32be4fa642ff56c7d72c7b0e845638e68986a94822'
  },
  {
    name: 'self cycle',
    make: () => {
      const obj = {}
      obj.self = obj
      return obj
    },
    // Serialized input: {"self":"[ref-0]"}
    blake2sHex: '6f819dd3b85bca104c5e43c383c38dd76079486b0988c0c0633d5a8782497067',
    blake2bHex: '51a744f655afa57880662e31083825881a0d385bf6e288fdac34e46d8d43179c8c4dad1888e70e4883808b226775a5585c75613aa946a1fc54efdb0cd57297bd'
  },
  {
    name: 'ancestor cycle',
    make: () => {
      const obj = { child: {} }
      obj.child.parent = obj
      return obj
    },
    // Serialized input: {"child":{"parent":"[ref-0]"}}
    blake2sHex: 'b1b833e4914333d1c5719f10abe0ee8020173871d022e0b267a4c72244e6bff0',
    blake2bHex: '6168d0fcb63b93a560497a0e74ff16658236a70e4c5963a3858dc55a5963dec839987cc1527358eb005d7d42c963bfea67d1643861decc2857a19da349a7b43a'
  },
  {
    name: 'array self cycle',
    make: () => {
      const array = []
      array.push(array)
      return array
    },
    // Serialized input: {"val":["[ref-1]"]}
    blake2sHex: '64983f4681bfdcefc05eb604a866d4af747b810c542d769a69a2aa391cc0334e',
    blake2bHex: 'f323defe6dfea1994e8c32c312edecdaeff2b713589d85412cab72ffde416900964ffa4fb1156319f0db933b90e15c73cf65676ab2583750d938ff24ca4cb6e0'
  },
  {
    name: 'toJSON result',
    make: () => ({ toJSON () { return { b: 2 } } }),
    // Serialized input: {"b":2}
    blake2sHex: 'd8877fecf23b21ad3b155dc65115a0ce666e60f1dc2b0729b8450a8618ca8f35',
    blake2bHex: '0b9b1fc881677a94c7dba7a193a4b4f619adbbb77a599ba86796eb419e4e69cd4e2d79decf9a4b664aef2146a05196bdd939af64f9fa41617fe8ec19fd8efe93'
  },
  {
    name: 'date wrapper and toJSON',
    make: () => new Date('2019-02-14T14:43:07.000Z'),
    // Serialized input: {"val":"2019-02-14T14:43:07.000Z"}
    blake2sHex: '9190e155322fc9e4238e6a5fee652e46b6f240cbb11f6c1ff6502c869e0317fd',
    blake2bHex: 'c14a6ecccbb3996a8c51e5988264db6dd2dbe45329a1bf1214ae2ca4a425a36dd26c8ba422b7fbbd626e87cf6c7fabc72e2a93554e719a4b8defdbb1ba31c32b'
  },
  {
    name: 'null-prototype object wrapper',
    make: () => Object.assign(Object.create(null), { a: 1 }),
    // Serialized input: {"val":{"a":1}}
    blake2sHex: 'dd76951d2b1f86b886babb27628b7ed69d50f5df134824bd5727f29e365542e0',
    blake2bHex: 'b8a8b33f124b36abe3a151c0505dc5ecf618bc66b99e4de04a5df8d3f7562a9560419ee35f5655a63bf57da022df231861ac391712fdea2516c5f1e791c31e6c'
  }
]

const entries = [
  ['source', getObjHash],
  ['package main', require('../../')],
  ['UMD CommonJS', require('../../dist/get-obj-hash.umd')]
]

entries.forEach(([name, hash]) => {
  describe(name + ' hash stability', () => {
    fixtures.forEach(fixture => {
      test(fixture.name, () => {
        expect(hash(fixture.make())).toBe(fixture.blake2sHex)
        expect(hash(fixture.make(), 'blake2sHex')).toBe(fixture.blake2sHex)
        expect(hash(fixture.make(), 'blake2bHex')).toBe(fixture.blake2bHex)
      })
    })

    test('omitted object properties do not affect the hash', () => {
      expect(hash({ a: 1, missing: undefined, fn () {}, symbol: Symbol('value') }))
        .toBe(hash({ a: 1 }))
    })

    test('a circular marker string can hash like a real cycle', () => {
      const cyclic = {}
      cyclic.self = cyclic
      expect(hash(cyclic)).toBe(hash({ self: '[ref-0]' }))
    })

    test('an unknown algorithm throws', () => {
      expect(() => hash({}, 'not-a-hash')).toThrow(TypeError)
    })

    test('serialization errors propagate', () => {
      const error = new Error('toJSON failed')
      expect(() => hash({ toJSON () { throw error } })).toThrow(error)
    })
  })
})
