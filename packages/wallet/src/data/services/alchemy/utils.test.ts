import { describe, expect, it } from 'vitest'

import {
  BASE_FEE_MULTIPLIER,
  calculateFeeParams,
  MIN_PRIORITY_FEE_WEI,
  processFeeHistory,
} from './utils'

const feeHistory = {
  // `eth_feeHistory` returns these as floats, not hex quantities.
  gasUsedRatio: [0.5355277, 0.5355277],
  baseFeePerGas: ['0xf2b1a8f0', '0xf2b1a8f0'],
  reward: [
    ['0x5d62', '0x12e2f10e', '0x3b9aca00'],
    ['0x5d62', '0x12e2f10e', '0x3b9aca00'],
  ],
}

describe('processFeeHistory', () => {
  it('reads gasUsedRatio as a float', () => {
    expect(processFeeHistory(feeHistory).averageGasUsedRatio).toBe(0.5355277)
  })

  it('averages to zero rather than NaN on an empty history', () => {
    const { averageGasUsedRatio, averageP50 } = processFeeHistory({
      gasUsedRatio: [],
      baseFeePerGas: [],
      reward: null,
    })

    expect(averageGasUsedRatio).toBe(0)
    expect(averageP50).toBe(0n)
  })
})

describe('calculateFeeParams', () => {
  const baseFee = 4_070_000_000n

  it('floors a tip when both signals sit under it', () => {
    const { priorityFee } = calculateFeeParams({
      baseFee,
      suggestedPriorityFee: 73_182n,
      averageP50: 19_819_790n,
    })

    expect(priorityFee).toBe(MIN_PRIORITY_FEE_WEI)
  })

  it('keeps the floor within an order of magnitude of a quiet-market median', () => {
    // The tip the floor imposes is quoted to the user, so a floor far over the
    // median paid inflates the quote by most of its own size.
    const quietMarketP50 = 62_000_000n

    const { priorityFee } = calculateFeeParams({
      baseFee: 110_000_000n,
      suggestedPriorityFee: 0n,
      averageP50: quietMarketP50,
    })

    expect(priorityFee).toBeLessThan(quietMarketP50 * 10n)
  })

  it('floors a zero tip', () => {
    expect(
      calculateFeeParams({ baseFee, suggestedPriorityFee: 0n, averageP50: 0n })
        .priorityFee,
    ).toBe(MIN_PRIORITY_FEE_WEI)
  })

  it('keeps a suggestion above the floor', () => {
    const suggestedPriorityFee = MIN_PRIORITY_FEE_WEI * 5n

    expect(
      calculateFeeParams({ baseFee, suggestedPriorityFee, averageP50: 0n })
        .priorityFee,
    ).toBe(suggestedPriorityFee)
  })

  it('takes the median when it beats both the suggestion and the floor', () => {
    const averageP50 = MIN_PRIORITY_FEE_WEI * 3n

    expect(
      calculateFeeParams({ baseFee, suggestedPriorityFee: 1n, averageP50 })
        .priorityFee,
    ).toBe(averageP50)
  })

  it('leaves the ceiling room for the base fee to climb', () => {
    const { priorityFee, maxFeePerGas } = calculateFeeParams({
      baseFee,
      suggestedPriorityFee: 0n,
      averageP50: 0n,
    })

    expect(maxFeePerGas).toBe(baseFee * BASE_FEE_MULTIPLIER + priorityFee)
    expect(maxFeePerGas).toBeGreaterThan(priorityFee)
  })
})
