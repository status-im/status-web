import type { PublicClient, WalletClient } from 'viem'

import { rewardsDistributorAbi } from '../abis/rewards-distributor'
import { getKarmaAddresses } from './addresses'

export async function getRewardsBalance(
  client: PublicClient,
  params: { account: `0x${string}`; chainId?: number },
): Promise<bigint> {
  const chainId = params.chainId ?? client.chain?.id
  if (!chainId) throw new Error('Chain ID required')
  const addresses = getKarmaAddresses(chainId)

  return client.readContract({
    address: addresses.rewardsDistributor,
    abi: rewardsDistributorAbi,
    functionName: 'rewardsBalanceOf',
    args: [params.account],
  })
}

export async function getRewardsBalanceOfAccount(
  client: PublicClient,
  params: { account: `0x${string}`; chainId?: number },
): Promise<bigint> {
  const chainId = params.chainId ?? client.chain?.id
  if (!chainId) throw new Error('Chain ID required')
  const addresses = getKarmaAddresses(chainId)

  return client.readContract({
    address: addresses.rewardsDistributor,
    abi: rewardsDistributorAbi,
    functionName: 'rewardsBalanceOfAccount',
    args: [params.account],
  })
}

export async function redeemRewards(
  walletClient: WalletClient,
  publicClient: PublicClient,
  params: { account: `0x${string}`; chainId?: number },
): Promise<`0x${string}`> {
  const chainId = params.chainId ?? walletClient.chain?.id
  if (!chainId) throw new Error('Chain ID required')
  const addresses = getKarmaAddresses(chainId)

  const { request } = await publicClient.simulateContract({
    address: addresses.rewardsDistributor,
    abi: rewardsDistributorAbi,
    functionName: 'redeemRewards',
    args: [params.account],
    account: params.account,
  })

  return walletClient.writeContract(request)
}

export async function getAvailableSupply(
  client: PublicClient,
  params?: { chainId?: number },
): Promise<bigint> {
  const chainId = params?.chainId ?? client.chain?.id
  if (!chainId) throw new Error('Chain ID required')
  const addresses = getKarmaAddresses(chainId)

  return client.readContract({
    address: addresses.rewardsDistributor,
    abi: rewardsDistributorAbi,
    functionName: 'availableSupply',
  })
}

export async function getMintedSupply(
  client: PublicClient,
  params?: { chainId?: number },
): Promise<bigint> {
  const chainId = params?.chainId ?? client.chain?.id
  if (!chainId) throw new Error('Chain ID required')
  const addresses = getKarmaAddresses(chainId)

  return client.readContract({
    address: addresses.rewardsDistributor,
    abi: rewardsDistributorAbi,
    functionName: 'mintedSupply',
  })
}

export async function getTotalRewardsSupply(
  client: PublicClient,
  params?: { chainId?: number },
): Promise<bigint> {
  const chainId = params?.chainId ?? client.chain?.id
  if (!chainId) throw new Error('Chain ID required')
  const addresses = getKarmaAddresses(chainId)

  return client.readContract({
    address: addresses.rewardsDistributor,
    abi: rewardsDistributorAbi,
    functionName: 'totalRewardsSupply',
  })
}

export async function setRewardsSupplier(
  walletClient: WalletClient,
  publicClient: PublicClient,
  params: {
    rewardsSupplier: `0x${string}`
    account: `0x${string}`
    chainId?: number
  },
): Promise<`0x${string}`> {
  const chainId = params.chainId ?? walletClient.chain?.id
  if (!chainId) throw new Error('Chain ID required')
  const addresses = getKarmaAddresses(chainId)

  const { request } = await publicClient.simulateContract({
    address: addresses.rewardsDistributor,
    abi: rewardsDistributorAbi,
    functionName: 'setRewardsSupplier',
    args: [params.rewardsSupplier],
    account: params.account,
  })

  return walletClient.writeContract(request)
}

export async function setReward(
  walletClient: WalletClient,
  publicClient: PublicClient,
  params: {
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
    address: addresses.rewardsDistributor,
    abi: rewardsDistributorAbi,
    functionName: 'setReward',
    args: [params.amount, params.duration],
    account: params.account,
  })

  return walletClient.writeContract(request)
}

export async function mintRewards(
  walletClient: WalletClient,
  publicClient: PublicClient,
  params: {
    recipient: `0x${string}`
    amount: bigint
    account: `0x${string}`
    chainId?: number
  },
): Promise<`0x${string}`> {
  const chainId = params.chainId ?? walletClient.chain?.id
  if (!chainId) throw new Error('Chain ID required')
  const addresses = getKarmaAddresses(chainId)

  const { request } = await publicClient.simulateContract({
    address: addresses.rewardsDistributor,
    abi: rewardsDistributorAbi,
    functionName: 'mint',
    args: [params.recipient, params.amount],
    account: params.account,
  })

  return walletClient.writeContract(request)
}

export async function distributeRewardsBatch(
  walletClient: WalletClient,
  publicClient: PublicClient,
  params: {
    distributions: Array<{ recipient: `0x${string}`; amount: bigint }>
    account: `0x${string}`
    chainId?: number
  },
): Promise<`0x${string}`[]> {
  const txHashes: `0x${string}`[] = []

  for (const distribution of params.distributions) {
    const txHash = await mintRewards(walletClient, publicClient, {
      recipient: distribution.recipient,
      amount: distribution.amount,
      account: params.account,
      chainId: params.chainId,
    })
    txHashes.push(txHash)
  }

  return txHashes
}
