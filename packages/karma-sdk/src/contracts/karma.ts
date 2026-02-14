import { karmaAbi } from '../abis/karma'
import { getKarmaAddresses } from './addresses'

import type { PublicClient, WalletClient } from 'viem'

export async function getKarmaBalance(
  client: PublicClient,
  params: { account: `0x${string}`; chainId?: number },
): Promise<bigint> {
  const chainId = params.chainId ?? client.chain?.id
  if (!chainId) throw new Error('Chain ID required')
  const addresses = getKarmaAddresses(chainId)

  return client.readContract({
    address: addresses.karma,
    abi: karmaAbi,
    functionName: 'balanceOf',
    args: [params.account],
  })
}

export async function getActualKarmaBalance(
  client: PublicClient,
  params: { account: `0x${string}`; chainId?: number },
): Promise<bigint> {
  const chainId = params.chainId ?? client.chain?.id
  if (!chainId) throw new Error('Chain ID required')
  const addresses = getKarmaAddresses(chainId)

  return client.readContract({
    address: addresses.karma,
    abi: karmaAbi,
    functionName: 'actualTokenBalanceOf',
    args: [params.account],
  })
}

export async function getKarmaTotalSupply(
  client: PublicClient,
  params?: { chainId?: number },
): Promise<bigint> {
  const chainId = params?.chainId ?? client.chain?.id
  if (!chainId) throw new Error('Chain ID required')
  const addresses = getKarmaAddresses(chainId)

  return client.readContract({
    address: addresses.karma,
    abi: karmaAbi,
    functionName: 'totalSupply',
  })
}

export async function getRewardDistributors(
  client: PublicClient,
  params?: { chainId?: number },
): Promise<readonly `0x${string}`[]> {
  const chainId = params?.chainId ?? client.chain?.id
  if (!chainId) throw new Error('Chain ID required')
  const addresses = getKarmaAddresses(chainId)

  return client.readContract({
    address: addresses.karma,
    abi: karmaAbi,
    functionName: 'getRewardDistributors',
  })
}

export async function setKarmaReward(
  walletClient: WalletClient,
  publicClient: PublicClient,
  params: {
    rewardsDistributor: `0x${string}`
    amount: bigint
    duration: bigint
    account: `0x${string}`
    chainId?: number
  },
): Promise<`0x${string}`> {
  const chainId = params.chainId ?? walletClient.chain?.id
  if (!chainId) throw new Error('Chain ID required')
  const addresses = getKarmaAddresses(chainId)

  const { request } = await publicClient.simulateContract({
    address: addresses.karma,
    abi: karmaAbi,
    functionName: 'setReward',
    args: [params.rewardsDistributor, params.amount, params.duration],
    account: params.account,
  })

  return walletClient.writeContract(request)
}
