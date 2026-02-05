import { rewardsDistributorAbi } from '../abis/rewards-distributor'
import { getKarmaAddresses } from './addresses'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = any

export async function getRewardsBalance(
  client: AnyClient,
  params: { account: `0x${string}`; chainId?: number }
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
  client: AnyClient,
  params: { account: `0x${string}`; chainId?: number }
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
  walletClient: AnyClient,
  publicClient: AnyClient,
  params: { account: `0x${string}`; chainId?: number }
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
  client: AnyClient,
  params?: { chainId?: number }
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
  client: AnyClient,
  params?: { chainId?: number }
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
  client: AnyClient,
  params?: { chainId?: number }
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
  walletClient: AnyClient,
  publicClient: AnyClient,
  params: {
    rewardsSupplier: `0x${string}`
    account: `0x${string}`
    chainId?: number
  }
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
  walletClient: AnyClient,
  publicClient: AnyClient,
  params: {
    amount: bigint
    duration: bigint
    account: `0x${string}`
    chainId?: number
  }
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
  walletClient: AnyClient,
  publicClient: AnyClient,
  params: {
    recipient: `0x${string}`
    amount: bigint
    account: `0x${string}`
    chainId?: number
  }
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
  walletClient: AnyClient,
  publicClient: AnyClient,
  params: {
    distributions: Array<{ recipient: `0x${string}`; amount: bigint }>
    account: `0x${string}`
    chainId?: number
  }
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
