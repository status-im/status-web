import { expect, test, vi } from 'vitest'

import {
  ACCOUNT_DISCOVERY_GAP_LIMIT,
  discoverAccounts,
} from './account-discovery'
import { getWalletCore } from './wallet'

const MNEMONIC = 'test test test test test test test test test test test junk'

// First addresses derived from MNEMONIC at m/44'/60'/0'/0/{index}
const ADDRESSES = [
  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
  '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
  '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
  '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
]

function activeAt(...addresses: string[]) {
  const active = new Set(addresses)
  return vi.fn(async (address: string) => active.has(address))
}

test('imports only account 0 when no address has activity', async () => {
  const walletCore = await getWalletCore()
  const isAddressActive = activeAt()

  const accounts = await discoverAccounts({
    walletCore,
    mnemonic: MNEMONIC,
    isAddressActive,
  })

  expect(accounts.map(a => a.address)).toEqual([ADDRESSES[0]])
  expect(accounts[0].derivationPath).toBe("m/44'/60'/0'/0/0")
  expect(accounts[0].active).toBe(false)
  // the scanned gap plus the informational check of account 0
  expect(isAddressActive).toHaveBeenCalledTimes(ACCOUNT_DISCOVERY_GAP_LIMIT + 1)
}, 15000)

test('imports consecutive active accounts', async () => {
  const walletCore = await getWalletCore()

  const accounts = await discoverAccounts({
    walletCore,
    mnemonic: MNEMONIC,
    gapLimit: 5,
    isAddressActive: activeAt(ADDRESSES[1], ADDRESSES[2]),
  })

  expect(accounts.map(a => a.address)).toEqual(ADDRESSES.slice(0, 3))
  expect(accounts.map(a => a.derivationPath)).toEqual([
    "m/44'/60'/0'/0/0",
    "m/44'/60'/0'/0/1",
    "m/44'/60'/0'/0/2",
  ])
  expect(accounts.map(a => a.active)).toEqual([false, true, true])
}, 15000)

test('skips inactive addresses within the gap but imports active ones past them', async () => {
  const walletCore = await getWalletCore()

  const accounts = await discoverAccounts({
    walletCore,
    mnemonic: MNEMONIC,
    gapLimit: 5,
    isAddressActive: activeAt(ADDRESSES[5]),
  })

  expect(accounts.map(a => a.address)).toEqual([ADDRESSES[0], ADDRESSES[5]])
  expect(accounts[1].derivationPath).toBe("m/44'/60'/0'/0/5")
}, 15000)

test('stops after the gap limit of consecutive inactive addresses', async () => {
  const walletCore = await getWalletCore()
  const isAddressActive = activeAt(ADDRESSES[1])

  const accounts = await discoverAccounts({
    walletCore,
    mnemonic: MNEMONIC,
    gapLimit: 3,
    isAddressActive,
  })

  expect(accounts.map(a => a.address)).toEqual([ADDRESSES[0], ADDRESSES[1]])
  // account 0, then indices 1 (active) and 2, 3, 4 (inactive) close the gap of 3
  expect(isAddressActive).toHaveBeenCalledTimes(5)
}, 15000)

test('stops at the max index when every address is active', async () => {
  const walletCore = await getWalletCore()
  const isAddressActive = vi.fn(async () => true)

  const accounts = await discoverAccounts({
    walletCore,
    mnemonic: MNEMONIC,
    gapLimit: 3,
    maxIndex: 7,
    isAddressActive,
  })

  // indices 0 through 7, all active
  expect(accounts).toHaveLength(8)
  expect(accounts.at(-1)?.derivationPath).toBe("m/44'/60'/0'/0/7")
  // indices 1..7 plus the informational check of account 0
  expect(isAddressActive).toHaveBeenCalledTimes(8)
}, 15000)

test('falls back to the accounts found so far when activity checks fail', async () => {
  const walletCore = await getWalletCore()
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

  try {
    const accounts = await discoverAccounts({
      walletCore,
      mnemonic: MNEMONIC,
      isAddressActive: async () => {
        throw new Error('network down')
      },
    })

    expect(accounts.map(a => a.address)).toEqual([ADDRESSES[0]])
    expect(warn).toHaveBeenCalled()
  } finally {
    warn.mockRestore()
  }
}, 15000)
