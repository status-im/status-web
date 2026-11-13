import { act } from 'react'

import { type Account, parseConnection, type ScannedUR } from '@qrkit/core'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ScannerScreen } from './index'

import type { Root } from 'react-dom/client'

const scanner = vi.hoisted(() => ({
  onScan: undefined as
    | ((result: ScannedUR | string) => boolean | void)
    | undefined,
}))

vi.mock('@qrkit/react', () => ({
  useQRScanner: (options: { onScan: NonNullable<typeof scanner.onScan> }) => {
    scanner.onScan = options.onScan
    return { videoRef: { current: null }, progress: null, error: null }
  },
}))

vi.mock(import('@qrkit/core'), async importOriginal => ({
  ...(await importOriginal()),
  parseConnection: vi.fn(),
}))

const SCANNED = { type: 'crypto-hdkey', cbor: new Uint8Array() } as ScannedUR

function evmAccount(accountIndex: number): Account {
  const accountPath = `m/44'/60'/${accountIndex}'`
  return {
    chain: 'evm',
    xpub: `xpub-account-${accountIndex}`,
    derivationPath: accountPath,
    sourceFingerprint: 0x12345678,
    device: 'Keycard',
    deriveAddress: (index: number) => ({
      chain: 'evm',
      address: `0x${accountIndex}${index}`,
      publicKey: `0x02${accountIndex}${index}`,
      derivationPath: `${accountPath}/0/${index}`,
      sourceFingerprint: 0x12345678,
      device: 'Keycard',
    }),
  }
}

let container: HTMLDivElement
let root: Root
const onAccounts = vi.fn()

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.clearAllMocks()
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  act(() => root.render(<ScannerScreen onAccounts={onAccounts} />))
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.unstubAllGlobals()
})

describe('ScannerScreen', () => {
  it('offers the first five addresses of the scanned account', () => {
    vi.mocked(parseConnection).mockReturnValue([evmAccount(0)])

    act(() => {
      scanner.onScan!(SCANNED)
    })

    const accounts = onAccounts.mock.calls[0][0]
    expect(
      accounts.map((a: { derivationPath: string }) => a.derivationPath),
    ).toEqual([
      "m/44'/60'/0'/0/0",
      "m/44'/60'/0'/0/1",
      "m/44'/60'/0'/0/2",
      "m/44'/60'/0'/0/3",
      "m/44'/60'/0'/0/4",
    ])
    expect(accounts[3]).toEqual({
      chain: 'evm',
      address: '0x03',
      derivationPath: "m/44'/60'/0'/0/3",
      publicKey: '0x0203',
      sourceFingerprint: 0x12345678,
      device: 'Keycard',
      xpub: 'xpub-account-0',
      accountPath: "m/44'/60'/0'",
    })
  })

  it('keeps each address with the account key it came from', () => {
    vi.mocked(parseConnection).mockReturnValue([evmAccount(0), evmAccount(1)])

    act(() => {
      scanner.onScan!(SCANNED)
    })

    const accounts = onAccounts.mock.calls[0][0]
    expect(accounts).toHaveLength(10)
    expect(accounts[7]).toMatchObject({
      derivationPath: "m/44'/60'/1'/0/2",
      xpub: 'xpub-account-1',
      accountPath: "m/44'/60'/1'",
    })
  })
})
