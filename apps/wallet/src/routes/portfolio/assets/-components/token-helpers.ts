import { formatEther, Interface } from 'ethers'

import {
  patchAssetsAllWithAnvilBalance,
  patchNativeTokenWithAnvilBalance,
} from '@/lib/anvil-balance'

import type { ApiOutput, NetworkType } from '@status-im/wallet/data'

export type TokenData =
  | ApiOutput['assets']['token']
  | ApiOutput['assets']['nativeToken']
export type AssetsResponse = ApiOutput['assets']['all']
export type AssetData = ApiOutput['assets']['all']['assets'][number]
export type TokenMetadata = NonNullable<
  NonNullable<TokenData['assets']>[NetworkType]
>['metadata']

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

export const NETWORKS = ['ethereum'] as const
const ANVIL_RPC_URL = 'http://127.0.0.1:8545'

export const erc20 = new Interface([
  'function transfer(address to, uint256 amount)',
])

// Helper function to build tRPC API URL with query parameters
export function buildTrpcUrl(
  endpoint: string,
  params: Record<string, unknown>,
): URL {
  const url = new URL(
    `${import.meta.env.WXT_STATUS_API_URL}/api/trpc/${endpoint}`,
  )
  url.searchParams.set(
    'input',
    JSON.stringify({
      json: params,
    }),
  )
  return url
}

// Helper function to fetch data from tRPC API
export async function fetchTrpcData<T>(
  endpoint: string,
  params: Record<string, unknown>,
  errorMessage: string,
): Promise<T> {
  const url = buildTrpcUrl(endpoint, params)
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(errorMessage)
  }

  const body = await response.json()
  const data = body.result.data.json as T

  if (endpoint === 'assets.all' && typeof params.address === 'string') {
    return (await patchAssetsAllWithAnvilBalance(
      data as AssetsResponse,
      params.address,
    )) as T
  }

  if (endpoint === 'assets.nativeToken' && typeof params.address === 'string') {
    return (await patchNativeTokenWithAnvilBalance(
      data as ApiOutput['assets']['nativeToken'],
      params.address,
    )) as T
  }

  return data
}

// Helper function to get token endpoint based on ticker
export function getTokenEndpoint(
  ticker: string,
): 'assets.token' | 'assets.nativeToken' {
  return ticker.startsWith('0x') ? 'assets.token' : 'assets.nativeToken'
}

// Helper function to build token query parameters
export function buildTokenQueryParams(
  ticker: string,
  address: string,
  options?: {
    skipMetadata?: boolean
    previousMetadata?: TokenMetadata
  },
): Record<string, unknown> {
  const baseParams: Record<string, unknown> = {
    address,
    networks: NETWORKS,
    ...(ticker.startsWith('0x') ? { contract: ticker } : { symbol: ticker }),
  }

  if (options?.skipMetadata) {
    baseParams.skipMetadata = true
  }

  if (options?.previousMetadata) {
    baseParams.previousMetadata = options.previousMetadata
  }

  return baseParams
}

// Helper function to build gas fee estimation parameters
export function buildGasFeeParams(
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

// Helper function to fetch gas fees
export async function fetchGasFees(
  from: string,
  to: string,
  value: string,
  isNative: boolean,
  contractAddress?: string,
): Promise<GasFees> {
  const params = buildGasFeeParams(isNative, from, to, value, contractAddress)

  const [estimateGasResponse, priorityFeeResponse, latestBlockResponse] =
    await Promise.all([
      fetch(ANVIL_RPC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_estimateGas',
          params: [params],
        }),
        cache: 'no-store',
      }),
      fetch(ANVIL_RPC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 2,
          method: 'eth_maxPriorityFeePerGas',
          params: [],
        }),
        cache: 'no-store',
      }),
      fetch(ANVIL_RPC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 3,
          method: 'eth_getBlockByNumber',
          params: ['latest', false],
        }),
        cache: 'no-store',
      }),
    ])

  if (
    !estimateGasResponse.ok ||
    !priorityFeeResponse.ok ||
    !latestBlockResponse.ok
  ) {
    throw new Error('Failed to fetch gas fees')
  }

  const estimateGasBody = (await estimateGasResponse.json()) as {
    result?: string
  }
  const priorityFeeBody = (await priorityFeeResponse.json()) as {
    result?: string
  }
  const latestBlockBody = (await latestBlockResponse.json()) as {
    result?: { baseFeePerGas?: string }
  }

  const gasLimit = BigInt(estimateGasBody.result ?? '0x5208')
  const maxPriorityFeePerGas = BigInt(priorityFeeBody.result ?? '0x0')
  const baseFeePerGas = BigInt(latestBlockBody.result?.baseFeePerGas ?? '0x0')
  const maxFeePerGas =
    baseFeePerGas > 0n
      ? baseFeePerGas * 2n + maxPriorityFeePerGas
      : maxPriorityFeePerGas || 1_500_000_000n

  const maxFeeEth = Number(formatEther(gasLimit * maxFeePerGas))

  return {
    feeEth: maxFeeEth,
    feeEur: 0,
    maxFeeEth,
    maxFeeEur: 0,
    confirmationTime: '~1s',
    txParams: {
      gasLimit: `0x${gasLimit.toString(16)}`,
      maxFeePerGas: `0x${maxFeePerGas.toString(16)}`,
      maxPriorityFeePerGas: `0x${maxPriorityFeePerGas.toString(16)}`,
    },
  }
}

export function matchesAsset(asset: AssetData, ticker: string): boolean {
  if (ticker.startsWith('0x')) {
    return (
      ('contract' in asset &&
        asset.contract?.toLowerCase() === ticker.toLowerCase()) ||
      false
    )
  } else {
    return asset.symbol?.toLowerCase() === ticker.toLowerCase()
  }
}

export function matchesTokenSummary(
  summary: TokenData['summary'],
  ticker: string,
): boolean {
  if (ticker.startsWith('0x')) {
    return summary.contracts?.ethereum?.toLowerCase() === ticker.toLowerCase()
  } else {
    return summary.symbol?.toUpperCase() === ticker.toUpperCase()
  }
}

export function getTokenMetadata(
  tokenDetail: TokenData | undefined,
  shouldUse: boolean,
): TokenMetadata | undefined {
  if (!tokenDetail?.assets || !shouldUse) {
    return undefined
  }
  return Object.values(tokenDetail.assets)[0]?.metadata
}
