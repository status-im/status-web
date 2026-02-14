// Note: all files under /admin-panel are for testing. Please don't review this file
export const INITIAL_BATCH_JSON =
  '[\n  {"recipient":"0x0000000000000000000000000000000000000000","amount":"1000000000000000000"}\n]'

export const INITIAL_MERKLE_ENTRIES_JSON =
  '[\n  {"account":"0x0000000000000000000000000000000000000000","amount":"1000000000000000000"}\n]'

export type RewardSupplyData = {
  availableSupply: bigint
  mintedSupply: bigint
  totalRewardsSupply: bigint
  distributors: readonly `0x${string}`[]
}
