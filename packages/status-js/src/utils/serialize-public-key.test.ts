import { expect, test } from 'vitest'

import { serializePublicKey } from './serialize-public-key'

test('should serialize compressed public key to base58btc encoding', () => {
  expect(
    serializePublicKey(
      '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb4542955133',
    ),
  ).toEqual('zQ3shY7r4cAdg4eUF5dfcuCqCFzWmdjHW4SX5hspM9ucAarfU')
})

test('should serialize uncompressed public key to base58btc encoding', () => {
  expect(
    serializePublicKey(
      '0x049f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb454295513305b23fcf11d005ee622144fc402b713a8928f80d705781e2e78d701c6e01bfc4',
    ),
  ).toEqual('zQ3shY7r4cAdg4eUF5dfcuCqCFzWmdjHW4SX5hspM9ucAarfU')
})

test('should return the public key if already serialized to base58btc encoding', () => {
  expect(
    serializePublicKey('zQ3shY7r4cAdg4eUF5dfcuCqCFzWmdjHW4SX5hspM9ucAarfU'),
  ).toEqual('zQ3shY7r4cAdg4eUF5dfcuCqCFzWmdjHW4SX5hspM9ucAarfU')
})

test('should throw when serializing unsupported multibase encoding', () => {
  expect(() =>
    serializePublicKey('ZQ3shY7r4cAdg4eUF5dfcuCqCFzWmdjHW4SX5hspM9ucAarfU'),
  ).toThrowError()
})

test('should throw when serializing invalid public key', () => {
  expect(() =>
    serializePublicKey(
      '0x019f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb4542955133',
    ),
  ).toThrowError()
})
