// ABIs
export {
  karmaAbi,
  karmaAirdropAbi,
  karmaTierAbi,
  rewardsDistributorAbi,
} from './abis'

// Contract addresses & constants
export type { KarmaChainId } from './contracts/addresses'
export {
  getKarmaAddresses,
  KARMA_ADDRESSES,
  KARMA_CHAIN_IDS,
} from './contracts/addresses'

// Contract interaction functions
export {
  getActualKarmaBalance,
  getKarmaBalance,
  getKarmaTotalSupply,
  getRewardDistributors,
  setKarmaReward,
} from './contracts/karma'
export {
  claimAirdrop,
  getAirdropMerkleRoot,
  isAirdropClaimed,
  setAirdropMerkleRoot,
} from './contracts/karma-airdrop'
export { getKarmaTiers, getTierIdByBalance } from './contracts/karma-tier'
export {
  distributeRewardsBatch,
  getAvailableSupply,
  getMintedSupply,
  getRewardsBalance,
  getRewardsBalanceOfAccount,
  getTotalRewardsSupply,
  mintRewards,
  redeemRewards,
  setReward,
  setRewardsSupplier,
} from './contracts/rewards-distributor'

// API Client
export {
  createSiweAuthHandlers,
  getCurrentUser,
  getQuota,
  getSession,
  signOut,
  verifyMessage,
} from './api/auth'
export { getPowCaptchaEndpoint, isValidCaptchaToken } from './api/captcha'
export type { KarmaApiClientConfig } from './api/client'
export { KarmaApiClient, KarmaApiError } from './api/client'
export { claimKarmaViaPow } from './api/sybil'

// Merkle tree utilities
export type { AirdropEntry, MerkleTreeOutput } from './merkle'
export { buildMerkleTree, hashLeaf, verifyMerkleProof } from './merkle'
export { parseMerkleTreeOutput, serializeMerkleTreeOutput } from './merkle'

// Types
export type {
  ClaimKarmaResponse,
  CurrentUser,
  KarmaLevel,
  KarmaTier,
  QuotaResponse,
  SiweSession,
} from './types'
