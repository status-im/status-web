import { rewardDistributorAbi } from '../abis/rewards-distributor'
import { getKarmaAddresses } from './addresses'

import type { Address } from '../types/common'
import type { PublicClient, WalletClient } from 'viem'

function resolveDistributorAddress(
  chainId: number | undefined,
  contractAddress?: Address,
): Address {
  if (contractAddress) return contractAddress
  if (!chainId) throw new Error('Chain ID or contractAddress required')
  return getKarmaAddresses(chainId).statusRewardsDistributor
}

// ---------------------------------------------------------------------------
// IRewardDistributor base interface functions
// ---------------------------------------------------------------------------

export async function getRewardsBalance(
  client: PublicClient,
  params: { account: Address; chainId?: number; contractAddress?: Address },
): Promise<bigint> {
  const address = resolveDistributorAddress(
    params.chainId ?? client.chain?.id,
    params.contractAddress,
  )

  return client.readContract({
    address,
    abi: rewardDistributorAbi,
    functionName: 'rewardsBalanceOf',
    args: [params.account],
  })
}

export async function getRewardsBalanceOfAccount(
  client: PublicClient,
  params: { account: Address; chainId?: number; contractAddress?: Address },
): Promise<bigint> {
  const address = resolveDistributorAddress(
    params.chainId ?? client.chain?.id,
    params.contractAddress,
  )

  return client.readContract({
    address,
    abi: rewardDistributorAbi,
    functionName: 'rewardsBalanceOfAccount',
    args: [params.account],
  })
}

export async function getTotalRewardsSupply(
  client: PublicClient,
  params?: { chainId?: number; contractAddress?: Address },
): Promise<bigint> {
  const address = resolveDistributorAddress(
    params?.chainId ?? client.chain?.id,
    params?.contractAddress,
  )

  return client.readContract({
    address,
    abi: rewardDistributorAbi,
    functionName: 'totalRewardsSupply',
  })
}

export async function setReward(
  walletClient: WalletClient,
  publicClient: PublicClient,
  params: {
    amount: bigint
    duration: bigint
    account: Address
    chainId?: number
    contractAddress?: Address
  },
): Promise<Address> {
  const address = resolveDistributorAddress(
    params.chainId ?? walletClient.chain?.id,
    params.contractAddress,
  )

  const { request } = await publicClient.simulateContract({
    address,
    abi: rewardDistributorAbi,
    functionName: 'setReward',
    args: [params.amount, params.duration],
    account: params.account,
  })

  return walletClient.writeContract(request)
}

export async function redeemRewards(
  walletClient: WalletClient,
  publicClient: PublicClient,
  params: { account: Address; chainId?: number; contractAddress?: Address },
): Promise<Address> {
  const address = resolveDistributorAddress(
    params.chainId ?? walletClient.chain?.id,
    params.contractAddress,
  )

  const { request } = await publicClient.simulateContract({
    address,
    abi: rewardDistributorAbi,
    functionName: 'redeemRewards',
    args: [params.account],
    account: params.account,
  })

  return walletClient.writeContract(request)
}

export async function isPaused(
  client: PublicClient,
  params?: { chainId?: number; contractAddress?: Address },
): Promise<boolean> {
  const address = resolveDistributorAddress(
    params?.chainId ?? client.chain?.id,
    params?.contractAddress,
  )

  return client.readContract({
    address,
    abi: rewardDistributorAbi,
    functionName: 'isPaused',
  })
}
