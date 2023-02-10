import { expect, test } from 'vitest'

import { deserializePublicKey } from './deserialize-public-key'

test('should deserialize public key from compressed base58btc encoding', () => {
  expect(
    deserializePublicKey('zQ3shY7r4cAdg4eUF5dfcuCqCFzWmdjHW4SX5hspM9ucAarfU')
  ).toEqual(
    '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb4542955133'
  )
})

test('should deserialize public key from compressed hexadecimal encoding', () => {
  expect(
    deserializePublicKey(
      '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb4542955133'
    )
  ).toEqual(
    '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb4542955133'
  )
})

test('should deserialize public key from uncompressed hexadecimal encoding', () => {
  expect(
    deserializePublicKey(
      '0x049f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb454295513305b23fcf11d005ee622144fc402b713a8928f80d705781e2e78d701c6e01bfc4'
    )
  ).toEqual(
    '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb4542955133'
  )
})

test('should throw when deserializing unsupported multibase encoding', () => {
  expect(() =>
    deserializePublicKey('ZQ3shY7r4cAdg4eUF5dfcuCqCFzWmdjHW4SX5hspM9ucAarfU')
  ).toThrowError()
})

test('should throw when deserializing invalid public key', () => {
  expect(() =>
    deserializePublicKey(
      '0x019f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb4542955133'
    )
  ).toThrowError()
})
