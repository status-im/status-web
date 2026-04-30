import { useCallback } from 'react'

import { GasShiftedError } from '@status-im/wallet/constants'
import { useQuery } from '@tanstack/react-query'
import { Interface, isAddress } from 'ethers'

import { fetchTrpcData } from '@/utils/trpc'

const GAS_FEES_STALE_TIME = 8 * 1000
const GAS_FEES_REFETCH_INTERVAL = 12 * 1000
const ALLOWED_GAS_SLIPPAGE_PERCENT = 30n
const erc20 = new Interface(['function transfer(address to, uint256 amount)'])

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

type GasInput = {
  to: string
  value: string
}

type UseGasFeesOptions = {
  address?: string
  gasInput?: GasInput | null
  isNative?: boolean
  contractAddress?: string
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

function buildGasFeeParams(
  isNative: boolean,
  from: string,
  to: string,
  value: string,
  contractAddress?: string,
): GasFeeRequestParams {
  if (isNative) {
    return { from, to, value }
  }

  if (!contractAddress) {
    throw new Error('Contract address not found')
  }

  const amount = BigInt(value)
  const data = erc20.encodeFunctionData('transfer', [to, amount])

  return {
    from,
    to: contractAddress,
    value: '0x0',
    data,
  }
}

async function requestFeeRate(params: GasFeeRequestParams): Promise<GasFees> {
  const normalizedParams: GasFeeRequestParams = {
    ...params,
    value: params.value ? toRpcHex(params.value) : params.value,
  }

  return fetchTrpcData<GasFees>(
    'nodes.getFeeRate',
    {
      network: 'ethereum',
      params: normalizedParams,
    },
    'Failed to fetch gas fees',
  )
}

export const useGasFees = ({
  address,
  gasInput,
  isNative = true,
  contractAddress,
}: UseGasFeesOptions = {}) => {
  const query = useQuery<GasFees>({
    queryKey: ['gas-fees', address, gasInput?.to, gasInput?.value],
    queryFn: async ({ queryKey }) => {
      const [, from, to, value] = queryKey as [string, string, string, string]
      const params = buildGasFeeParams(
        isNative,
        from,
        to,
        value,
        contractAddress,
      )
      return requestFeeRate(params)
    },
    enabled:
      !!gasInput?.to &&
      isAddress(gasInput.to) &&
      !!gasInput?.value &&
      !!address,
    staleTime: GAS_FEES_STALE_TIME,
    refetchInterval: GAS_FEES_REFETCH_INTERVAL,
  })

  // Exposed for imperative use cases (e.g. signer-context tx send path) that need fees
  // on-demand, while most UI flows (e.g. token.tsx) can rely on the hook query lifecycle.
  const fetchGasFees = useCallback(
    (params: GasFeeRequestParams): Promise<GasFees> => requestFeeRate(params),
    [],
  )

  const checkAndRefreshGasFees = async (): Promise<GasFees> => {
    if (!query.data) {
      throw new Error('Gas fees not available')
    }

    const oldMaxFeePerGas = query.data.txParams.maxFeePerGas

    const fresh = await query.refetch()
    if (!fresh.data) {
      throw new Error("Couldn't refresh gas fees — try again")
    }

    const oldFee = BigInt(`0x${oldMaxFeePerGas.replace(/^0x/, '')}`)
    const newFee = BigInt(
      `0x${fresh.data.txParams.maxFeePerGas.replace(/^0x/, '')}`,
    )

    if (newFee >= (oldFee * (100n + ALLOWED_GAS_SLIPPAGE_PERCENT)) / 100n) {
      throw new GasShiftedError()
    }

    return fresh.data
  }

  return { ...query, fetchGasFees, checkAndRefreshGasFees }
}
