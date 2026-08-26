import { describe, expect, it } from 'vitest'

import { processFeeHistory } from './utils'

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
