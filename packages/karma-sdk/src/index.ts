// ABIs
export {
  karmaAbi,
  karmaAirdropAbi,
  karmaTierAbi,
  rewardDistributorAbi,
  statusRewardsDistributorAbi,
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
  getRewardsBalance,
  getRewardsBalanceOfAccount,
  getTotalRewardsSupply,
  isPaused,
  redeemRewards,
  setReward,
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

// === Class-based SDK ===
export { CHAIN_PRESETS } from './contracts/addresses'
export { AirdropModule } from './modules/airdrop'
export { KarmaModule } from './modules/karma'
export { RewardsDistributor } from './modules/rewards'
export { StatusKarmaDistributor } from './modules/status-rewards'
export { SybilModule } from './modules/sybil'
export { TiersModule } from './modules/tiers'
export { KarmaSDK, PRESET_API_URLS } from './sdk'
export type { Address, Hash, Hex } from './types/common'
export type {
  ChainConfig,
  ChainPreset,
  EIP1193Provider,
  KarmaSDKConfig,
  SDKMode,
} from './types/config'
