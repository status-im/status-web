import { act } from 'react'

import {
  buildEthSignRequestURParts,
  parseEthSignature,
  type ScannedUR,
} from '@qrkit/core'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { HardwareSignScreen } from './index'

import type { Root } from 'react-dom/client'

const scanner = vi.hoisted(() => ({
  onScan: undefined as
    | ((result: ScannedUR | string) => boolean | void)
    | undefined,
  enabled: false,
}))

vi.mock('@qrkit/react', () => ({
  QRDisplay: () => null,
  useQRScanner: (options: {
    onScan: NonNullable<typeof scanner.onScan>
    enabled: boolean
  }) => {
    scanner.onScan = options.onScan
    scanner.enabled = options.enabled
    return { videoRef: { current: null }, progress: null, error: null }
  },
}))

vi.mock(import('@qrkit/core'), async importOriginal => {
  const original = await importOriginal()
  return {
    ...original,
    buildEthSignRequestURParts: vi.fn(original.buildEthSignRequestURParts),
    parseEthSignature: vi.fn(),
  }
})

const parseSignature = vi.mocked(parseEthSignature)
const SCANNED = { type: 'eth-signature', cbor: new Uint8Array() } as ScannedUR

let container: HTMLDivElement
let root: Root
const checkSignature = vi.fn<(signature: string) => string | null>()
const onSignature = vi.fn()
const onCancel = vi.fn()

function pressButton(label: string) {
  const button = [...container.querySelectorAll('button')].find(
    element => element.textContent === label,
  )
  if (!button) throw new Error(`No "${label}" button`)
  act(() => button.click())
}

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.clearAllMocks()
  checkSignature.mockReturnValue(null)
  scanner.onScan = undefined
  scanner.enabled = false
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  act(() =>
    root.render(
      <HardwareSignScreen
        request={{
          kind: 'personalMessage',
          message: new TextEncoder().encode('hello'),
        }}
        address="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
        sourceFingerprint={0x12345678}
        derivationPath="m/44'/60'/1'/0/0"
        origin="Status Wallet"
        checkSignature={checkSignature}
        onSignature={onSignature}
        onCancel={onCancel}
      />,
    ),
  )
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.unstubAllGlobals()
})

describe('HardwareSignScreen', () => {
  it("asks the device to sign with the account's key", () => {
    expect(vi.mocked(buildEthSignRequestURParts)).toHaveBeenCalledWith(
      expect.objectContaining({
        address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        sourceFingerprint: 0x12345678,
        derivationPath: "m/44'/60'/1'/0/0",
      }),
    )
  })

  it('turns the camera on only after the request QR is shown', () => {
    expect(scanner.enabled).toBe(false)

    pressButton('Continue')

    expect(scanner.enabled).toBe(true)
  })

  it('shows why a scanned response could not be read and keeps scanning', () => {
    parseSignature.mockImplementation(() => {
      throw new Error('not an eth-signature')
    })
    pressButton('Continue')

    let accepted: boolean | void
    act(() => {
      accepted = scanner.onScan!(SCANNED)
    })

    expect(accepted!).toBe(false)
    expect(container.textContent).toContain('Parse error: not an eth-signature')
    expect(onSignature).not.toHaveBeenCalled()
  })

  it('hands a parsed signature to the caller', () => {
    parseSignature.mockReturnValue('0xsignature')
    pressButton('Continue')

    let accepted: boolean | void
    act(() => {
      accepted = scanner.onScan!(SCANNED)
    })

    expect(accepted!).toBe(true)
    expect(checkSignature).toHaveBeenCalledWith('0xsignature')
    expect(onSignature).toHaveBeenCalledWith('0xsignature')
  })

  it('keeps scanning when the signature fails the check', () => {
    parseSignature.mockReturnValue('0xsignature')
    checkSignature.mockReturnValue('Signed by 0xabc, not by this account.')
    pressButton('Continue')

    let accepted: boolean | void
    act(() => {
      accepted = scanner.onScan!(SCANNED)
    })

    expect(accepted!).toBe(false)
    expect(container.textContent).toContain(
      'Signed by 0xabc, not by this account.',
    )
    expect(onSignature).not.toHaveBeenCalled()
  })

  it('clears the error when going back to the request QR', () => {
    parseSignature.mockReturnValue('0xsignature')
    checkSignature.mockReturnValue('Signed by 0xabc, not by this account.')
    pressButton('Continue')
    act(() => {
      scanner.onScan!(SCANNED)
    })

    pressButton('Back to QR')
    pressButton('Continue')

    expect(container.textContent).not.toContain('Signed by 0xabc')
  })

  it('ignores plain-text QR codes', () => {
    pressButton('Continue')

    expect(scanner.onScan!('hello')).toBe(false)
    expect(parseSignature).not.toHaveBeenCalled()
  })

  it('cancels from either step', () => {
    pressButton('Cancel')
    pressButton('Continue')
    pressButton('Cancel')

    expect(onCancel).toHaveBeenCalledTimes(2)
  })
})
