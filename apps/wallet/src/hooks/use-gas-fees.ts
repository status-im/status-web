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
  address: string
  gasInput: GasInput | null
  isNative: boolean
  contractAddress?: string
}

function buildGasFeeParams(
  isNative: boolean,
  from: string,
  to: string,
  value: string,
  contractAddress?: string,
): Record<string, unknown> {
  if (isNative) {
    return {
      from,
      to,
      value,
    }
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

async function fetchGasFees(
  from: string,
  to: string,
  value: string,
  isNative: boolean,
  contractAddress?: string,
): Promise<GasFees> {
  const params = buildGasFeeParams(isNative, from, to, value, contractAddress)

  return fetchTrpcData<GasFees>(
    'nodes.getFeeRate',
    {
      network: 'ethereum',
      params,
    },
    'Failed to fetch gas fees',
  )
}

export const useGasFees = ({
  address,
  gasInput,
  isNative,
  contractAddress,
}: UseGasFeesOptions) => {
  const query = useQuery<GasFees>({
    queryKey: ['gas-fees', address, gasInput?.to, gasInput?.value],
    queryFn: async ({ queryKey }) => {
      const [, from, to, value] = queryKey as [string, string, string, string]
      return fetchGasFees(from, to, value, isNative, contractAddress)
    },
    enabled:
      !!gasInput?.to &&
      isAddress(gasInput.to) &&
      !!gasInput?.value &&
      !!address,
    staleTime: GAS_FEES_STALE_TIME,
    refetchInterval: GAS_FEES_REFETCH_INTERVAL,
  })

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

  return { ...query, checkAndRefreshGasFees }
}
