import { type Hex, padHex, parseTransaction } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { nonceTracker } from '../../lib/nonce-tracker'
import { broadcast } from './ethereum'
import {
  broadcastSignedEthTransaction,
  buildUnsignedEthTransaction,
} from './hardware-tx'

vi.mock('../../lib/nonce-tracker', () => ({
  nonceTracker: {
    reserveHeld: vi.fn(),
    commitHeld: vi.fn(),
    releaseHeld: vi.fn(),
  },
}))

vi.mock('./ethereum', () => ({ broadcast: vi.fn() }))

const tracker = vi.mocked(nonceTracker)
const broadcastMock = vi.mocked(broadcast)

// Hardhat's first dev key; stands in for the hardware device.
const device = privateKeyToAccount(
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
)
const RECIPIENT = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
const RESERVATION_ID = 'reservation-1'
const NONCE = 7
const TX_HASH = `0x${'ab'.repeat(32)}`

const BUILD_INPUT = {
  fromAddress: device.address,
  toAddress: RECIPIENT,
  value: '0x64',
  data: '0xdeadbeef',
  gasLimit: '0x5208',
  maxFeePerGas: '0x3b9aca00',
  maxInclusionFeePerGas: '0x5f5e100',
  network: 'ethereum',
  chainId: 1,
} as const

/** What viem would broadcast, and the device's r || s || v for it. */
async function signWithDevice(serializedUnsignedTx: Hex, vOffset: 0 | 27) {
  const signed = await device.signTransaction(
    parseTransaction(serializedUnsignedTx),
  )
  const { r, s, yParity } = parseTransaction(signed)
  const v = vOffset + yParity!
  const signature =
    `${padHex(r!, { size: 32 })}${padHex(s!, { size: 32 }).slice(2)}${v.toString(16).padStart(2, '0')}` as Hex
  return { signed, signature, v }
}

beforeEach(() => {
  vi.clearAllMocks()
  tracker.reserveHeld.mockResolvedValue({ id: RESERVATION_ID, nonce: NONCE })
  broadcastMock.mockResolvedValue(TX_HASH)
})

describe('buildUnsignedEthTransaction', () => {
  it('builds an EIP-1559 transaction at the reserved nonce', async () => {
    const result = await buildUnsignedEthTransaction(BUILD_INPUT)

    expect(tracker.reserveHeld).toHaveBeenCalledWith(device.address, 'ethereum')
    expect(result).toMatchObject({
      chainId: 1,
      nonceReservationId: RESERVATION_ID,
    })
    const tx = parseTransaction(result.serializedUnsignedTx)
    expect(tx).toMatchObject({
      type: 'eip1559',
      chainId: 1,
      nonce: NONCE,
      value: 100n,
      data: '0xdeadbeef',
      gas: 21000n,
      maxFeePerGas: 1_000_000_000n,
      maxPriorityFeePerGas: 100_000_000n,
    })
    expect(tx.to?.toLowerCase()).toBe(RECIPIENT.toLowerCase())
  })

  it('gives the nonce back when the transaction cannot be built', async () => {
    await expect(
      buildUnsignedEthTransaction({ ...BUILD_INPUT, value: '0xnothex' }),
    ).rejects.toThrow()

    expect(tracker.releaseHeld).toHaveBeenCalledWith(RESERVATION_ID)
  })
})

describe('broadcastSignedEthTransaction', () => {
  // Each value signs with the parity its v names under the dev key.
  it.each([
    { v: 0, value: '0x65' },
    { v: 1, value: '0x64' },
    { v: 27, value: '0x65' },
    { v: 28, value: '0x64' },
  ] as const)(
    'broadcasts what viem signs when the device answers v = $v',
    async ({ v: expectedV, value }) => {
      const { serializedUnsignedTx } = await buildUnsignedEthTransaction({
        ...BUILD_INPUT,
        value,
      })
      const { signed, signature, v } = await signWithDevice(
        serializedUnsignedTx,
        expectedV >= 27 ? 27 : 0,
      )
      expect(v).toBe(expectedV)

      const result = await broadcastSignedEthTransaction({
        serializedUnsignedTx,
        signature,
        network: 'ethereum',
        fromAddress: device.address,
        nonceReservationId: RESERVATION_ID,
      })

      expect(result).toEqual({ txid: TX_HASH })
      expect(broadcastMock).toHaveBeenCalledWith(signed.slice(2), 'ethereum')
      expect(tracker.commitHeld).toHaveBeenCalledWith(
        RESERVATION_ID,
        device.address,
        'ethereum',
        NONCE,
      )
      expect(tracker.releaseHeld).not.toHaveBeenCalled()
    },
  )

  it('refuses a signature that is not 65 bytes and gives the nonce back', async () => {
    const { serializedUnsignedTx } =
      await buildUnsignedEthTransaction(BUILD_INPUT)

    await expect(
      broadcastSignedEthTransaction({
        serializedUnsignedTx,
        signature: `0x${'ab'.repeat(64)}`,
        network: 'ethereum',
        fromAddress: device.address,
        nonceReservationId: RESERVATION_ID,
      }),
    ).rejects.toThrow('Expected 65-byte signature, got 64 bytes')

    expect(broadcastMock).not.toHaveBeenCalled()
    expect(tracker.releaseHeld).toHaveBeenCalledWith(RESERVATION_ID)
    expect(tracker.commitHeld).not.toHaveBeenCalled()
  })

  it('refuses a signature from another key and gives the nonce back', async () => {
    const { serializedUnsignedTx } =
      await buildUnsignedEthTransaction(BUILD_INPUT)
    const { signature } = await signWithDevice(serializedUnsignedTx, 0)

    await expect(
      broadcastSignedEthTransaction({
        serializedUnsignedTx,
        signature,
        network: 'ethereum',
        fromAddress: RECIPIENT,
        nonceReservationId: RESERVATION_ID,
      }),
    ).rejects.toThrow(`Signed by ${device.address}, not by ${RECIPIENT}`)

    expect(broadcastMock).not.toHaveBeenCalled()
    expect(tracker.releaseHeld).toHaveBeenCalledWith(RESERVATION_ID)
    expect(tracker.commitHeld).not.toHaveBeenCalled()
  })

  it('refuses a v that is neither a parity nor a legacy v', async () => {
    const { serializedUnsignedTx } =
      await buildUnsignedEthTransaction(BUILD_INPUT)
    const { signature } = await signWithDevice(serializedUnsignedTx, 0)

    await expect(
      broadcastSignedEthTransaction({
        serializedUnsignedTx,
        signature: `${signature.slice(0, -2)}02` as Hex,
        network: 'ethereum',
        fromAddress: device.address,
        nonceReservationId: RESERVATION_ID,
      }),
    ).rejects.toThrow('Unexpected signature v value 2')

    expect(broadcastMock).not.toHaveBeenCalled()
    expect(tracker.releaseHeld).toHaveBeenCalledWith(RESERVATION_ID)
  })

  it('gives the nonce back when the broadcast fails', async () => {
    const { serializedUnsignedTx } =
      await buildUnsignedEthTransaction(BUILD_INPUT)
    const { signature } = await signWithDevice(serializedUnsignedTx, 0)
    broadcastMock.mockRejectedValue(new Error('nonce too low'))

    await expect(
      broadcastSignedEthTransaction({
        serializedUnsignedTx,
        signature,
        network: 'ethereum',
        fromAddress: device.address,
        nonceReservationId: RESERVATION_ID,
      }),
    ).rejects.toThrow('nonce too low')

    expect(tracker.releaseHeld).toHaveBeenCalledWith(RESERVATION_ID)
    expect(tracker.commitHeld).not.toHaveBeenCalled()
  })
})
