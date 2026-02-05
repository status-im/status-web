import { karmaAbi } from '../abis/karma'
import { getKarmaAddresses } from './addresses'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = any

export async function getKarmaBalance(
  client: AnyClient,
  params: { account: `0x${string}`; chainId?: number }
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
  client: AnyClient,
  params: { account: `0x${string}`; chainId?: number }
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
  client: AnyClient,
  params?: { chainId?: number }
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
  client: AnyClient,
  params?: { chainId?: number }
): Promise<`0x${string}`[]> {
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
  walletClient: AnyClient,
  publicClient: AnyClient,
  params: {
    rewardsDistributor: `0x${string}`
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
    address: addresses.karma,
    abi: karmaAbi,
    functionName: 'setReward',
    args: [params.rewardsDistributor, params.amount, params.duration],
    account: params.account,
  })

  return walletClient.writeContract(request)
}
