import { rewardDistributorAbi } from '../abis/rewards-distributor'

import type { Address, Hash } from '../types/common'
import type { PublicClient, WalletClient } from 'viem'

/**
 * Abstract base class mirroring the IRewardDistributor Solidity interface.
 * Extend this class to implement specific distributor types.
 */
export abstract class RewardsDistributor {
  constructor(
    protected getPublicClient: () => PublicClient,
    protected getWalletClient: () => WalletClient | null,
    protected contractAddress: Address,
  ) {}

  async totalRewardsSupply(): Promise<bigint> {
    return this.getPublicClient().readContract({
      address: this.contractAddress,
      abi: rewardDistributorAbi,
      functionName: 'totalRewardsSupply',
    })
  }

  async rewardsBalanceOf(account: Address): Promise<bigint> {
    return this.getPublicClient().readContract({
      address: this.contractAddress,
      abi: rewardDistributorAbi,
      functionName: 'rewardsBalanceOf',
      args: [account],
    })
  }

  async rewardsBalanceOfAccount(user: Address): Promise<bigint> {
    return this.getPublicClient().readContract({
      address: this.contractAddress,
      abi: rewardDistributorAbi,
      functionName: 'rewardsBalanceOfAccount',
      args: [user],
    })
  }

  async setReward(params: {
    amount: bigint
    duration: bigint
    account: Address
  }): Promise<Hash> {
    const walletClient = this.requireWalletClient()
    const { request } = await this.getPublicClient().simulateContract({
      address: this.contractAddress,
      abi: rewardDistributorAbi,
      functionName: 'setReward',
      args: [params.amount, params.duration],
      account: params.account,
    })
    return walletClient.writeContract(request) as Promise<Hash>
  }

  async redeemRewards(account: Address): Promise<Hash> {
    const walletClient = this.requireWalletClient()
    const { request } = await this.getPublicClient().simulateContract({
      address: this.contractAddress,
      abi: rewardDistributorAbi,
      functionName: 'redeemRewards',
      args: [account],
      account,
    })
    return walletClient.writeContract(request) as Promise<Hash>
  }

  async isPaused(): Promise<boolean> {
    return this.getPublicClient().readContract({
      address: this.contractAddress,
      abi: rewardDistributorAbi,
      functionName: 'isPaused',
    })
  }

  protected requireWalletClient(): WalletClient {
    const wc = this.getWalletClient()
    if (!wc) {
      throw new Error(
        'SDK is in read-only mode. Provide privateKeyOrSigner for write operations.',
      )
    }
    return wc
  }
}
