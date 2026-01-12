import { Interface } from 'ethers'

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
  return body.result.data.json
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

  return fetchTrpcData<GasFees>(
    'nodes.getFeeRate',
    {
      network: 'ethereum',
      params,
    },
    'Failed to fetch gas fees',
  )
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
