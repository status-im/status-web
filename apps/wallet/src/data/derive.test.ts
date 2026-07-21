import { expect, test } from 'vitest'

import { deriveNextAccountIndex, pathAtIndex } from './derive'

import type { WalletAccount } from './wallet-metadata'

const ethereumAccount = (derivationPath: string): WalletAccount => ({
  address: '0x0000000000000000000000000000000000000000',
  coin: 60,
  derivationPath,
  derivation: 0,
})

test('pathAtIndex keeps the base path at index 0', () => {
  expect(pathAtIndex("m/44'/60'/0'/0/0", 0)).toBe("m/44'/60'/0'/0/0")
})

test('pathAtIndex replaces the last segment for other indices', () => {
  expect(pathAtIndex("m/44'/60'/0'/0/0", 3)).toBe("m/44'/60'/0'/0/3")
  expect(pathAtIndex("m/44'/501'/0'", 2)).toBe("m/44'/501'/2")
})

test('deriveNextAccountIndex starts at 0 without matching accounts', () => {
  expect(deriveNextAccountIndex([], 60)).toBe(0)
  expect(
    deriveNextAccountIndex(
      [{ ...ethereumAccount("m/44'/0'/0'/0/4"), coin: 0 }],
      60,
    ),
  ).toBe(0)
})

test('deriveNextAccountIndex continues after the highest index of the coin', () => {
  const accounts = [
    ethereumAccount("m/44'/60'/0'/0/0"),
    ethereumAccount("m/44'/60'/0'/0/5"),
    { ...ethereumAccount("m/44'/0'/0'/0/9"), coin: 0 },
  ]
  expect(deriveNextAccountIndex(accounts, 60)).toBe(6)
})
