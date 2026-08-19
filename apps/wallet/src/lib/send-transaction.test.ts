import { describe, expect, test, vi } from 'vitest'

import {
  buildAndSendTransaction,
  needsFeeEstimate,
  resolveFeeParams,
  type TransactionSenders,
} from './send-transaction'

import type { GasFees } from './gas-fees'

/** What the wallet's own estimator returns: 2*baseFee + its own priority. */
const ESTIMATE: GasFees = {
  feeEth: 0,
  feeEur: 0,
  maxFeeEth: 0,
  maxFeeEur: 0,
  confirmationTime: '~12s',
  txParams: {
    gasLimit: '0x5208',
    // 4 gwei ceiling over a 1 gwei tip, so 3 gwei of base-fee headroom.
    maxFeePerGas: '0xee6b2800',
    maxPriorityFeePerGas: '0x3b9aca00',
  },
}

const TO = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' as const
const HASH = `0x${'cd'.repeat(32)}`

describe('resolveFeeParams', () => {
  test('a wallet-originated transaction is priced entirely by the estimator', () => {
    expect(resolveFeeParams({ to: TO, value: 1n }, ESTIMATE)).toEqual({
      gasLimit: '0x5208',
      maxFeePerGas: '0xee6b2800',
      maxPriorityFeePerGas: '0x3b9aca00',
    })
  })

  // The LiFi swap path: the SDK strips maxFeePerGas but keeps the quoted
  // priority, so the ceiling must clear it or the node rejects the broadcast.
  test('a quoted priority fee keeps the estimator base-fee headroom', () => {
    const quotedPriority = 2_000_000_000n

    const fees = resolveFeeParams(
      { to: TO, value: 1n, maxPriorityFeePerGas: quotedPriority },
      ESTIMATE,
    )

    // 3 gwei headroom + the 2 gwei quoted tip.
    expect(fees.maxFeePerGas).toBe('0x12a05f200')
    expect(fees.maxPriorityFeePerGas).toBe('0x77359400')
    expect(BigInt(fees.maxFeePerGas)).toBeGreaterThan(quotedPriority)
  })

  test('caller-provided fields are not overwritten', () => {
    expect(
      resolveFeeParams(
        {
          to: TO,
          value: 1n,
          gas: 0x30000n,
          maxFeePerGas: 0x12a05f200n,
          maxPriorityFeePerGas: 0x3b9aca00n,
        },
        null,
      ),
    ).toEqual({
      gasLimit: '0x30000',
      maxFeePerGas: '0x12a05f200',
      maxPriorityFeePerGas: '0x3b9aca00',
    })
  })

  test('a tip above the ceiling is clamped to it', () => {
    const fees = resolveFeeParams(
      { to: TO, value: 1n, maxFeePerGas: 1_000_000_000n },
      ESTIMATE,
    )

    expect(fees.maxPriorityFeePerGas).toBe(fees.maxFeePerGas)
  })

  test('a zero priority fee is honoured rather than treated as absent', () => {
    expect(
      resolveFeeParams(
        { to: TO, value: 1n, maxPriorityFeePerGas: 0n },
        ESTIMATE,
      ).maxPriorityFeePerGas,
    ).toBe('0x0')
  })
})

describe('needsFeeEstimate', () => {
  test('is true unless every fee field is present', () => {
    expect(needsFeeEstimate({ to: TO, value: 1n })).toBe(true)
    expect(
      needsFeeEstimate({ to: TO, value: 1n, gas: 1n, maxFeePerGas: 1n }),
    ).toBe(true)
    expect(
      needsFeeEstimate({
        to: TO,
        value: 1n,
        gas: 1n,
        maxFeePerGas: 1n,
        maxPriorityFeePerGas: 0n,
      }),
    ).toBe(false)
  })
})

function createSenders(): TransactionSenders & {
  calls: Array<{ via: string; input: Record<string, unknown> }>
} {
  const calls: Array<{ via: string; input: Record<string, unknown> }> = []
  const record = (via: string) => async (input: Record<string, unknown>) => {
    calls.push({ via, input })
    return { id: { txid: HASH } }
  }
  return {
    calls,
    send: record('send'),
    sendErc20: record('sendErc20'),
    sendContractCall: record('sendContractCall'),
  } as TransactionSenders & { calls: typeof calls }
}

describe('buildAndSendTransaction', () => {
  const ctx = {
    walletId: 'wallet-1',
    address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as const,
    fetchGasFees: vi.fn(async () => ESTIMATE),
  }

  test('an ERC20 transfer takes the token route', async () => {
    const senders = createSenders()

    await expect(
      buildAndSendTransaction(
        { to: TO, value: 0n, data: `0xa9059cbb${'00'.repeat(64)}` },
        ctx,
        senders,
      ),
    ).resolves.toBe(HASH)
    expect(senders.calls[0].via).toBe('sendErc20')
  })

  test('a failed broadcast surfaces the node error', async () => {
    const senders = createSenders()
    senders.send = async () => ({
      id: {
        txid: {
          error:
            'insufficient funds for gas * price + value: have 1 want 1000000000000000000',
        },
      },
    })

    await expect(
      buildAndSendTransaction({ to: TO, value: 1n }, ctx, senders),
    ).rejects.toThrow(/Insufficient funds for gas/)
  })

  test('a response carrying no usable hash is a failure', async () => {
    const senders = createSenders()
    senders.send = async () => ({ id: { txid: null } })

    await expect(
      buildAndSendTransaction({ to: TO, value: 1n }, ctx, senders),
    ).rejects.toThrow('Transaction failed')
  })
})
