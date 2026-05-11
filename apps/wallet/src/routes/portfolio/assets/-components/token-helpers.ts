import type { ApiOutput, NetworkType } from '@status-im/wallet/data'

export type TokenData =
  | ApiOutput['assets']['token']
  | ApiOutput['assets']['nativeToken']
export type AssetsResponse = ApiOutput['assets']['all']
export type AssetData = ApiOutput['assets']['all']['assets'][number]
export type TokenMetadata = NonNullable<
  NonNullable<TokenData['assets']>[NetworkType]
>['metadata']

export const NETWORKS = ['ethereum'] as const

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
