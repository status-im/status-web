import { expect, test } from 'vitest'

import {
  hexToColorHash,
  publicKeyToColorHash,
} from './public-key-to-color-hash'

test('should return color hash from public key', () => {
  expect(
    publicKeyToColorHash(
      '0x04e25da6994ea2dc4ac70727e07eca153ae92bf7609db7befb7ebdceaad348f4fc55bbe90abf9501176301db5aa103fc0eb3bc3750272a26c424a10887db2a7ea8'
    )
  ).toEqual([
    [3, 30],
    [2, 10],
    [5, 5],
    [3, 14],
    [5, 4],
    [4, 19],
    [3, 16],
    [4, 0],
    [5, 28],
    [4, 13],
    [4, 15],
  ])
})

test('should throw for invalid public keys', () => {
  expect(() => publicKeyToColorHash('abc')).toThrow()
  expect(() => publicKeyToColorHash('0x01')).toThrow()
  expect(() =>
    publicKeyToColorHash(
      '0x01e25da6994ea2dc4ac70727e07eca153ae92bf7609db7befb7ebdceaad348f4fc55bbe90abf9501176301db5aa103fc0eb3bc3750272a26c424a10887db2a7ea8'
    )
  ).toThrow()
  expect(() =>
    publicKeyToColorHash(
      '0x04425da6994ea2dc4ac70727e07eca153ae92bf7609db7befb7ebdceaad348f4fc55bbe90abf9501176301db5aa103fc0eb3bc3750272a26c424a10887db2a7ea8'
    )
  ).toThrow()
})

test('should return color hash from hex', () => {
  expect(hexToColorHash('0', 4, 4)).toEqual([[1, 0]])
  expect(hexToColorHash('1', 4, 4)).toEqual([[1, 1]])
  expect(hexToColorHash('4', 4, 4)).toEqual([[2, 0]])
  expect(hexToColorHash('F', 4, 4)).toEqual([[4, 3]])
})

test('should return color hash from hex with reduced collision resistance', () => {
  expect(hexToColorHash('FF', 4, 4)).toEqual([
    [4, 3],
    [4, 0],
  ])
  expect(hexToColorHash('FC', 4, 4)).toEqual([
    [4, 3],
    [4, 0],
  ])
  expect(hexToColorHash('FFFF', 4, 4)).toEqual([
    [4, 3],
    [4, 0],
    [4, 3],
    [4, 0],
  ])
})
