import { match } from 'ts-pattern'

// Considering https://www.alchemy.com/docs/how-to-build-a-gas-fee-estimator-using-eip-1559

type FeeHistory = {
  gasUsedRatio: string[]
  baseFeePerGas: string[]
  reward: Array<string[]> | null
}

export function processFeeHistory(feeHistory: FeeHistory) {
  const blocks = feeHistory.gasUsedRatio.map((ratioHex, i) => {
    const baseFeePerGas = BigInt(feeHistory.baseFeePerGas[i])

    const reward = feeHistory.reward?.[i] ?? []

    return {
      gasUsedRatio: parseInt(ratioHex, 16) / 0x10000,
      baseFeePerGas,
      priorityFeePerGas: {
        p10: reward[0] ? BigInt(reward[0]) : 0n,
        p50: reward[1] ? BigInt(reward[1]) : 0n,
        p90: reward[2] ? BigInt(reward[2]) : 0n,
      },
    }
  })

  const average = (getter: (block: (typeof blocks)[0]) => number) =>
    blocks.reduce((sum, b) => sum + getter(b), 0) / blocks.length

  return {
    blocks,
    averageGasUsedRatio: average(b => b.gasUsedRatio),
    averageP10: BigInt(
      Math.round(average(b => Number(b.priorityFeePerGas.p10))),
    ),
    averageP50: BigInt(
      Math.round(average(b => Number(b.priorityFeePerGas.p50))),
    ),
    averageP90: BigInt(
      Math.round(average(b => Number(b.priorityFeePerGas.p90))),
    ),
  }
}

type FeeAverages = {
  averageP10: bigint
  averageP50: bigint
  averageP90: bigint
  averageGasUsedRatio: number
}

export function estimateConfirmationTime(
  priorityFeeWei: bigint,
  { averageP10, averageP50, averageP90, averageGasUsedRatio }: FeeAverages,
): string {
  const toGwei = (wei: bigint) => Number(wei) / 1e9

  const priorityFeeGwei = toGwei(priorityFeeWei)
  const p10 = toGwei(averageP10)
  const p50 = toGwei(averageP50)
  const p90 = toGwei(averageP90)

  const multiplier = match(averageGasUsedRatio)
    .when(
      ratio => ratio > 0.8,
      () => 1.5,
    )
    .when(
      ratio => ratio < 0.3,
      () => 0.7,
    )
    .otherwise(() => 1)

  const base = match(priorityFeeGwei)
    .when(
      fee => fee >= p90,
      () => 15,
    )
    .when(
      fee => fee >= p50,
      () => 30,
    )
    .when(
      fee => fee >= p10,
      () => 90,
    )
    .otherwise(() => 300)

  const seconds = Math.round(base * multiplier)

  return match(seconds)
    .when(
      s => s <= 20,
      () => '~15-30s',
    )
    .when(
      s => s <= 60,
      () => '~30-60s',
    )
    .when(
      s => s <= 120,
      () => '~1-2min',
    )
    .when(
      s => s <= 300,
      () => '~2-5min',
    )
    .otherwise(() => '~5-10min')
}
