export interface Vault {
  id: string
  address: `0x${string}`
  staked: bigint
  unlocksIn: number | null
  boost: number
  potentialBoost?: number
  karma: number
  locked: boolean
}

export type VaultColumnMeta = {
  headerClassName?: string
  cellClassName?: string
  footerClassName?: string
}
