import { rewardsDistributorAbi } from '../abis/rewards-distributor'
import { RewardsDistributor } from './rewards'

import type { Address, Hash } from '../types/common'

/**
 * Status-specific rewards distributor with additional methods
 * beyond the base IRewardDistributor interface.
 */
export class StatusKarmaDistributor extends RewardsDistributor {
  async getAvailableSupply(): Promise<bigint> {
    return this.getPublicClient().readContract({
      address: this.contractAddress,
      abi: rewardsDistributorAbi,
      functionName: 'availableSupply',
    })
  }

  async getMintedSupply(): Promise<bigint> {
    return this.getPublicClient().readContract({
      address: this.contractAddress,
      abi: rewardsDistributorAbi,
      functionName: 'mintedSupply',
    })
  }

  async mintRewards(params: {
    recipient: Address
    amount: bigint
    account: Address
  }): Promise<Hash> {
    const walletClient = this.requireWalletClient()
    const { request } = await this.getPublicClient().simulateContract({
      address: this.contractAddress,
      abi: rewardsDistributorAbi,
      functionName: 'mint',
      args: [params.recipient, params.amount],
      account: params.account,
    })
    return walletClient.writeContract(request) as Promise<Hash>
  }

  async setRewardsSupplier(params: {
    rewardsSupplier: Address
    account: Address
  }): Promise<Hash> {
    const walletClient = this.requireWalletClient()
    const { request } = await this.getPublicClient().simulateContract({
      address: this.contractAddress,
      abi: rewardsDistributorAbi,
      functionName: 'setRewardsSupplier',
      args: [params.rewardsSupplier],
      account: params.account,
    })
    return walletClient.writeContract(request) as Promise<Hash>
  }

  async distributeRewardsBatch(params: {
    distributions: Array<{ recipient: Address; amount: bigint }>
    account: Address
  }): Promise<Hash[]> {
    const txHashes: Hash[] = []
    for (const distribution of params.distributions) {
      const txHash = await this.mintRewards({
        recipient: distribution.recipient,
        amount: distribution.amount,
        account: params.account,
      })
      txHashes.push(txHash)
    }
    return txHashes
  }
}
