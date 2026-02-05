// ABIs
export {
  karmaAbi,
  rewardsDistributorAbi,
  karmaTierAbi,
  karmaAirdropAbi,
} from './abis'

// Contract addresses & constants
export {
  getKarmaAddresses,
  KARMA_ADDRESSES,
  KARMA_CHAIN_IDS,
} from './contracts/addresses'
export type { KarmaChainId } from './contracts/addresses'

// Contract interaction functions
export {
  getKarmaBalance,
  getActualKarmaBalance,
  getKarmaTotalSupply,
  getRewardDistributors,
  setKarmaReward,
} from './contracts/karma'

export { getKarmaTiers, getTierIdByBalance } from './contracts/karma-tier'

export {
  getRewardsBalance,
  getRewardsBalanceOfAccount,
  redeemRewards,
  getAvailableSupply,
  getMintedSupply,
  getTotalRewardsSupply,
  setRewardsSupplier,
  setReward,
  mintRewards,
  distributeRewardsBatch,
} from './contracts/rewards-distributor'

export {
  isAirdropClaimed,
  claimAirdrop,
  getAirdropMerkleRoot,
} from './contracts/karma-airdrop'

// API Client
export { KarmaApiClient, KarmaApiError } from './api/client'
export type { KarmaApiClientConfig } from './api/client'

export {
  verifyMessage,
  getSession,
  signOut,
  getCurrentUser,
  getQuota,
  createSiweAuthHandlers,
} from './api/auth'
export { getPowCaptchaEndpoint, isValidCaptchaToken } from './api/captcha'

export { claimKarmaViaPow } from './api/sybil'

// Merkle tree utilities
export { buildMerkleTree, hashLeaf, verifyMerkleProof } from './merkle'
export {
  parseMerkleTreeOutput,
  serializeMerkleTreeOutput,
} from './merkle'
export type { AirdropEntry, MerkleTreeOutput } from './merkle'

// Types
export type {
  KarmaTier,
  KarmaLevel,
  CurrentUser,
  SiweSession,
  QuotaResponse,
  ClaimKarmaResponse,
} from './types'
