import { fetchTrpcData } from '../utils/trpc'

const GAS_LIMIT_BUFFER_PERCENT = 10n

export type GasFees = {
  feeEth: number
  feeEur: number
  maxFeeEth: number
  maxFeeEur: number
  confirmationTime: string
  txParams: {
    gasLimit: string
    maxFeePerGas: string
    maxPriorityFeePerGas: string
  }
}

export type GasFeeRequestParams = {
  from: string
  to: string
  value?: string
  data?: string
}

function toRpcHex(value: string): string {
  if (value.startsWith('0x')) return value
  if (value === '') return '0x0'
  return `0x${value}`
}

/**
 * Lives outside `use-gas-fees.ts` so the service worker can price a dApp's
 * `eth_sendTransaction` without pulling React, react-query and ethers into the
 * background bundle.
 *
 * `network` stays hardcoded: `nodes.getFeeRate` pins `z.enum(['ethereum'])`.
 */
export async function requestFeeRate(
  params: GasFeeRequestParams,
  includeGasLimitBuffer: boolean = true,
): Promise<GasFees> {
  const normalizedParams: GasFeeRequestParams = {
    ...params,
    value: params.value ? toRpcHex(params.value) : params.value,
  }

  const gasFees = await fetchTrpcData<GasFees>(
    'nodes.getFeeRate',
    {
      network: 'ethereum',
      params: normalizedParams,
    },
    'Failed to fetch gas fees',
  )

  if (!includeGasLimitBuffer) {
    return gasFees
  }

  const estimatedGasLimit = BigInt(gasFees.txParams.gasLimit)
  const gasLimitWithBuffer =
    estimatedGasLimit + (estimatedGasLimit * GAS_LIMIT_BUFFER_PERCENT) / 100n

  return {
    ...gasFees,
    txParams: {
      ...gasFees.txParams,
      gasLimit: `0x${gasLimitWithBuffer.toString(16)}`,
    },
  }
}
