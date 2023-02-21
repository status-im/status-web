import { expect, test } from 'vitest'

import { publicKeyToEmojiHash } from './public-key-to-emoji-hash'

test('should return emoji hash from public key', () => {
  expect(
    publicKeyToEmojiHash(
      '0x04e25da6994ea2dc4ac70727e07eca153ae92bf7609db7befb7ebdceaad348f4fc55bbe90abf9501176301db5aa103fc0eb3bc3750272a26c424a10887db2a7ea8'
    )
  ).toEqual('👦🏽🦹🏻👶🏿🛁🌁🙌🏻🙇🏽‍♂️🙌🏾🤥🐛👩🏽‍🔧🔧⚙️🧒🏽')
  expect(
    publicKeyToEmojiHash(
      '0x0400000000000000000000000000000000000000000000000000000000000000014218F20AE6C646B363DB68605822FB14264CA8D2587FDD6FBC750D587E76A7EE'
    )
  ).toEqual('😀😀😀😀😀😀😀😀😀😀😀😀😀😀')
  expect(
    publicKeyToEmojiHash(
      '0x04000000000000000000000000000000000000000010000000000000000000000033600332D373318ECC2F212A30A5750D2EAC827B6A32B33D326CCF369B12B1BE'
    )
  ).toEqual('😀😀😀😀😀😀😀😀😀😀😀😀😀😃')
  expect(
    publicKeyToEmojiHash(
      '0x040000000000000000000000000000000000000000200000000000000000000000353050BFE33B724E60A0C600FBA565A9B62217B1BD35BF9848F2AB847C598B30'
    )
  ).toEqual('😀😀😀😀😀😀😀😀😀😀😀😀😀😄')
})

test('should throw for invalid public keys', () => {
  expect(() => publicKeyToEmojiHash('abc')).toThrow()
  expect(() => publicKeyToEmojiHash('0x01')).toThrow()
  expect(() =>
    publicKeyToEmojiHash(
      '0x01e25da6994ea2dc4ac70727e07eca153ae92bf7609db7befb7ebdceaad348f4fc55bbe90abf9501176301db5aa103fc0eb3bc3750272a26c424a10887db2a7ea8'
    )
  ).toThrow()
  expect(() =>
    publicKeyToEmojiHash(
      '0x04425da6994ea2dc4ac70727e07eca153ae92bf7609db7befb7ebdceaad348f4fc55bbe90abf9501176301db5aa103fc0eb3bc3750272a26c424a10887db2a7ea8'
    )
  ).toThrow()
})
