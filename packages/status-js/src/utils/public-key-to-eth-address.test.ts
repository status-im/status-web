import { expect, test } from 'vitest'

import { publicKeyToETHAddress } from './public-key-to-eth-address'

test('should return ETH address from public key', () => {
  expect(
    publicKeyToETHAddress(
      '0x02bcbe39785b55a22383f82ac631ea7500e204627369c4ea01d9296af0ea573f57',
    ),
  ).toEqual('0x0A1ec0002dDB927B03049F1aD8D589aBEA4Ba4b3')
})
