// @vitest-environment happy-dom

import { act } from 'react'

import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InsufficientFundsError } from '../lib/send-transaction'
import { SignerProvider, useWalletSigner } from './signer-context'

import type { Root } from 'react-dom/client'

const mocks = vi.hoisted(() => {
  class HardwareSignCancelledError extends Error {}
  return {
    HardwareSignCancelledError,
    screen: null as null | {
      request: unknown
      address: string
      sourceFingerprint: number | undefined
      onSignature: (signature: string) => void
      onCancel: () => void
    },
    build: vi.fn(),
    broadcast: vi.fn(),
    release: vi.fn(),
    signMessage: vi.fn(),
    sessionStatus: vi.fn(),
    requestPassword: vi.fn(),
    wallet: {} as Record<string, unknown>,
  }
})

vi.mock('@status-im/wallet/components', () => ({
  HardwareSignCancelledError: mocks.HardwareSignCancelledError,
  HardwareSignScreen: (props: NonNullable<typeof mocks.screen>) => {
    mocks.screen = props
    return null
  },
}))

vi.mock('./api-client', () => ({
  apiClient: {
    wallet: {
      account: {
        ethereum: {
          buildUnsignedTransaction: { mutate: mocks.build },
          broadcastSignedTransaction: { mutate: mocks.broadcast },
          releaseNonceReservation: { mutate: mocks.release },
          signMessage: { mutate: mocks.signMessage },
        },
      },
    },
    session: { status: { query: mocks.sessionStatus } },
  },
}))

vi.mock('./wallet-context', () => ({
  useWallet: () => ({
    currentWallet: mocks.wallet,
    currentAccount: { address: ADDRESS },
  }),
}))

// The flag stays false, as it does in the render where the user pressed Send.
vi.mock('./password-context', () => ({
  usePassword: () => ({
    hasActiveSession: false,
    requestPassword: mocks.requestPassword,
    clearSession: vi.fn(),
  }),
}))

vi.mock('../hooks/use-gas-fees', () => ({
  useGasFees: () => ({ fetchGasFees: vi.fn() }),
}))

const ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

const HARDWARE_WALLET = {
  id: 'hardware-1',
  name: 'Keystone',
  type: 'hardware-qr',
  hardware: { sourceFingerprint: 0x12345678 },
}
const SOFTWARE_WALLET = { id: 'software-1', name: 'Wallet', type: 'mnemonic' }
const UNSIGNED_TX = '0x02c90180808080808080c0'
const RESERVATION_ID = 'reservation-1'
const TX_HASH = `0x${'ab'.repeat(32)}`

// Fully priced, so the hardware path does not reach the fee estimator.
const TX = {
  to: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  value: 100n,
  gas: 21000n,
  maxFeePerGas: 1_000_000_000n,
  maxPriorityFeePerGas: 100_000_000n,
} as const

let container: HTMLDivElement
let root: Root
let signer: ReturnType<typeof useWalletSigner>

function CaptureSigner() {
  signer = useWalletSigner()
  return null
}

/** Lets the build call settle and the overlay render. */
async function settle() {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0))
  })
}

/** Wrapped so callers skip waiting for the send and no rejection goes unobserved. */
async function startSend() {
  const outcome = signer.signAndSendTransaction(TX).then(
    hash => ({ hash }),
    (error: unknown) => ({ error }),
  )
  await settle()
  return { outcome }
}

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.stubGlobal('chrome', {
    storage: { session: { set: vi.fn(), remove: vi.fn() } },
  })
  mocks.screen = null
  mocks.wallet = HARDWARE_WALLET
  mocks.signMessage.mockReset().mockResolvedValue({ signature: '0xsoftsig' })
  mocks.sessionStatus.mockReset().mockResolvedValue({ isUnlocked: false })
  mocks.requestPassword.mockReset().mockResolvedValue(false)
  mocks.build.mockReset().mockResolvedValue({
    serializedUnsignedTx: UNSIGNED_TX,
    chainId: 1,
    nonceReservationId: RESERVATION_ID,
  })
  mocks.broadcast.mockReset().mockResolvedValue({ txid: TX_HASH })
  mocks.release.mockReset().mockResolvedValue(undefined)

  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  act(() =>
    root.render(
      <SignerProvider>
        <CaptureSigner />
      </SignerProvider>,
    ),
  )
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.unstubAllGlobals()
})

describe('hardware wallet transactions', () => {
  it('broadcasts the device signature under the held nonce', async () => {
    const { outcome } = await startSend()

    expect(mocks.build).toHaveBeenCalledWith(
      expect.objectContaining({
        walletId: 'hardware-1',
        fromAddress: ADDRESS,
        gasLimit: '0x5208',
        maxFeePerGas: '0x3b9aca00',
        maxInclusionFeePerGas: '0x5f5e100',
      }),
    )
    expect(mocks.screen).toMatchObject({
      request: { kind: 'transaction', chainId: 1 },
      address: ADDRESS,
      sourceFingerprint: 0x12345678,
    })

    act(() => mocks.screen!.onSignature('0xsignature'))

    await expect(outcome).resolves.toEqual({ hash: TX_HASH })
    expect(mocks.broadcast).toHaveBeenCalledWith({
      serializedUnsignedTx: UNSIGNED_TX,
      signature: '0xsignature',
      fromAddress: ADDRESS,
      nonceReservationId: RESERVATION_ID,
    })
    expect(mocks.release).not.toHaveBeenCalled()
  })

  it('releases the held nonce when the user cancels', async () => {
    const { outcome } = await startSend()

    act(() => mocks.screen!.onCancel())

    const { error } = (await outcome) as { error: unknown }
    expect(error).toBeInstanceOf(mocks.HardwareSignCancelledError)
    expect(mocks.release).toHaveBeenCalledWith({
      nonceReservationId: RESERVATION_ID,
    })
    expect(mocks.broadcast).not.toHaveBeenCalled()
  })

  it('translates a node insufficient-funds rejection', async () => {
    mocks.broadcast.mockRejectedValue(
      new Error('insufficient funds for gas * price + value: have 1 want 2'),
    )
    const { outcome } = await startSend()

    act(() => mocks.screen!.onSignature('0xsignature'))

    const { error } = (await outcome) as { error: unknown }
    expect(error).toBeInstanceOf(InsufficientFundsError)
  })
})

describe('hardware wallet signature requests', () => {
  it('refuses a second request while the QR screen is open', async () => {
    const { outcome: first } = await startSend()

    await expect(signer.signMessage('0x68656c6c6f')).rejects.toThrow(
      'Another hardware wallet signature is in progress',
    )

    act(() => mocks.screen!.onSignature('0xsignature'))
    await expect(first).resolves.toEqual({ hash: TX_HASH })
  })

  it('takes a new request once the previous one has finished', async () => {
    const { outcome: first } = await startSend()
    act(() => mocks.screen!.onCancel())
    await first

    let signing!: Promise<string>
    act(() => {
      signing = signer.signMessage('0x68656c6c6f')
    })
    expect(mocks.screen).toMatchObject({
      request: {
        kind: 'personalMessage',
        message: new TextEncoder().encode('hello'),
      },
    })

    act(() => mocks.screen!.onSignature('0xmessagesig'))
    await expect(signing).resolves.toBe('0xmessagesig')
  })
})

describe('software wallet unlocking', () => {
  beforeEach(() => {
    mocks.wallet = SOFTWARE_WALLET
    act(() =>
      root.render(
        <SignerProvider>
          <CaptureSigner />
        </SignerProvider>,
      ),
    )
  })

  it('does not ask again after an unlock earlier in the same action', async () => {
    mocks.sessionStatus.mockResolvedValue({ isUnlocked: true })

    await expect(signer.signMessage('0x68656c6c6f')).resolves.toBe('0xsoftsig')
    expect(mocks.requestPassword).not.toHaveBeenCalled()
  })

  it('asks for the password when the wallet is locked', async () => {
    mocks.requestPassword.mockResolvedValue(true)

    await expect(signer.signMessage('0x68656c6c6f')).resolves.toBe('0xsoftsig')
    expect(mocks.requestPassword).toHaveBeenCalledTimes(1)
  })

  it('does not sign when the password prompt is dismissed', async () => {
    await expect(signer.signMessage('0x68656c6c6f')).rejects.toThrow(
      'Wallet not unlocked',
    )
    expect(mocks.signMessage).not.toHaveBeenCalled()
  })
})
