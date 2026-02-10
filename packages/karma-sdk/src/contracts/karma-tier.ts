import { karmaTierAbi } from '../abis/karma-tier'
import { getKarmaAddresses } from './addresses'

import type { KarmaTier } from '../types'
import type { PublicClient } from 'viem'

export async function getKarmaTiers(
  client: PublicClient,
  params?: { chainId?: number },
): Promise<KarmaTier[]> {
  const chainId = params?.chainId ?? client.chain?.id
  if (!chainId) throw new Error('Chain ID required')
  const addresses = getKarmaAddresses(chainId)

  const tierCount = await client.readContract({
    address: addresses.karmaTier,
    abi: karmaTierAbi,
    functionName: 'getTierCount',
  })

  const tiers: KarmaTier[] = []
  for (let i = 0; i < Number(tierCount); i++) {
    const tier = await client.readContract({
      address: addresses.karmaTier,
      abi: karmaTierAbi,
      functionName: 'getTierById',
      args: [i],
    })

    tiers.push({
      id: i,
      minKarma: tier.minKarma,
      maxKarma: tier.maxKarma,
      name: tier.name,
      txPerEpoch: tier.txPerEpoch,
    })
  }

  return tiers
}

export async function getTierIdByBalance(
  client: PublicClient,
  params: { balance: bigint; chainId?: number },
): Promise<number> {
  const chainId = params.chainId ?? client.chain?.id
  if (!chainId) throw new Error('Chain ID required')
  const addresses = getKarmaAddresses(chainId)

  return client.readContract({
    address: addresses.karmaTier,
    abi: karmaTierAbi,
    functionName: 'getTierIdByKarmaBalance',
    args: [params.balance],
  })
}
