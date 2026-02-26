import { karmaAbi } from '../abis/karma'

import type { Address, Hash } from '../types/common'
import type { ChainConfig } from '../types/config'
import type { PublicClient, WalletClient } from 'viem'

export class KarmaModule {
  constructor(
    private getPublicClient: () => PublicClient,
    private getWalletClient: () => WalletClient | null,
    private chainConfig: ChainConfig,
  ) {}

  async balanceOf(account: Address): Promise<bigint> {
    return this.getPublicClient().readContract({
      address: this.chainConfig.contracts.karma,
      abi: karmaAbi,
      functionName: 'balanceOf',
      args: [account],
    })
  }

  async actualBalanceOf(account: Address): Promise<bigint> {
    return this.getPublicClient().readContract({
      address: this.chainConfig.contracts.karma,
      abi: karmaAbi,
      functionName: 'actualTokenBalanceOf',
      args: [account],
    })
  }

  async totalSupply(): Promise<bigint> {
    return this.getPublicClient().readContract({
      address: this.chainConfig.contracts.karma,
      abi: karmaAbi,
      functionName: 'totalSupply',
    })
  }

  async getRewardDistributors(): Promise<readonly Address[]> {
    return this.getPublicClient().readContract({
      address: this.chainConfig.contracts.karma,
      abi: karmaAbi,
      functionName: 'getRewardDistributors',
    })
  }

  async setReward(params: {
    rewardsDistributor: Address
    amount: bigint
    duration: bigint
    account: Address
  }): Promise<Hash> {
    const walletClient = this.requireWalletClient()
    const { request } = await this.getPublicClient().simulateContract({
      address: this.chainConfig.contracts.karma,
      abi: karmaAbi,
      functionName: 'setReward',
      args: [params.rewardsDistributor, params.amount, params.duration],
      account: params.account,
    })
    return walletClient.writeContract(request) as Promise<Hash>
  }

  private requireWalletClient(): WalletClient {
    const wc = this.getWalletClient()
    if (!wc) {
      throw new Error(
        'SDK is in read-only mode. Provide privateKeyOrSigner for write operations.',
      )
    }
    return wc
  }
}
