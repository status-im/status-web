import { karmaTierAbi } from '../abis/karma-tier'

import type { KarmaTier } from '../types'
import type { ChainConfig } from '../types/config'
import type { PublicClient } from 'viem'

export class TiersModule {
  constructor(
    private getPublicClient: () => PublicClient,
    private chainConfig: ChainConfig,
  ) {}

  async getTiers(): Promise<KarmaTier[]> {
    const client = this.getPublicClient()
    const address = this.chainConfig.contracts.karmaTier

    const tierCount = await client.readContract({
      address,
      abi: karmaTierAbi,
      functionName: 'getTierCount',
    })

    const tiers = (
      await Promise.all(
        Array.from({ length: Number(tierCount) }, (_, i) =>
          client.readContract({
            address,
            abi: karmaTierAbi,
            functionName: 'getTierById',
            args: [i],
          }),
        ),
      )
    ).map((tier, i) => ({
      id: i,
      minKarma: tier.minKarma,
      maxKarma: tier.maxKarma,
      name: tier.name,
      txPerEpoch: tier.txPerEpoch,
    }))

    return tiers
  }

  async getTierIdByBalance(balance: bigint): Promise<number> {
    return this.getPublicClient().readContract({
      address: this.chainConfig.contracts.karmaTier,
      abi: karmaTierAbi,
      functionName: 'getTierIdByKarmaBalance',
      args: [balance],
    })
  }
}
