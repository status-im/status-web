import { karmaTierAbi } from '../abis/karma-tier'
import { getKarmaAddresses } from './addresses'

import type { Address } from '../types/common'
import type { KarmaTier } from '../types'
import type { PublicClient } from 'viem'

function resolveTierAddress(
  chainId: number | undefined,
  contractAddress?: Address,
): Address {
  if (contractAddress) return contractAddress
  if (!chainId) throw new Error('Chain ID or contractAddress required')
  return getKarmaAddresses(chainId).karmaTier
}

export async function getKarmaTiers(
  client: PublicClient,
  params?: { chainId?: number; contractAddress?: Address },
): Promise<KarmaTier[]> {
  const address = resolveTierAddress(
    params?.chainId ?? client.chain?.id,
    params?.contractAddress,
  )

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

export async function getTierIdByBalance(
  client: PublicClient,
  params: { balance: bigint; chainId?: number; contractAddress?: Address },
): Promise<number> {
  const address = resolveTierAddress(
    params.chainId ?? client.chain?.id,
    params.contractAddress,
  )

  return client.readContract({
    address,
    abi: karmaTierAbi,
    functionName: 'getTierIdByKarmaBalance',
    args: [params.balance],
  })
}
