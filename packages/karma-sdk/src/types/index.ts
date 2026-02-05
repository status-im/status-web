export interface KarmaTier {
  id: number
  minKarma: bigint
  maxKarma: bigint
  name: string
  txPerEpoch: number
}

export interface KarmaLevel {
  level: number
  minKarma: bigint
  maxKarma: bigint
}

export interface CurrentUser {
  address: string
  connectedSybilProviders: string[]
  globalPosition: number
}

export interface SiweSession {
  address: `0x${string}`
  chainId: number
}

export interface QuotaResponse {
  address: string
  tier: {
    name: string
    quotaPerEpoch: string
  }
  epoch: {
    id: string
    txCount: string
    remainingQuota: string
    resetsAt: string
  }
  denyList: {
    isActive: boolean
    expiresAt: string | null
  }
  lastUpdatedAt: string
}

export interface ClaimKarmaResponse {
  result: {
    success: boolean
  }
}
