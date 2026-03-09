import { rewardsDistributorAbi } from '../abis/rewards-distributor'
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
    abi: rewardsDistributorAbi,
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
    abi: rewardsDistributorAbi,
    functionName: 'rewardsBalanceOfAccount',
    args: [params.account],
  })
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
    abi: rewardsDistributorAbi,
    functionName: 'redeemRewards',
    args: [params.account],
    account: params.account,
  })

  return walletClient.writeContract(request)
}

export async function getAvailableSupply(
  client: PublicClient,
  params?: { chainId?: number; contractAddress?: Address },
): Promise<bigint> {
  const address = resolveDistributorAddress(
    params?.chainId ?? client.chain?.id,
    params?.contractAddress,
  )

  return client.readContract({
    address,
    abi: rewardsDistributorAbi,
    functionName: 'availableSupply',
  })
}

export async function getMintedSupply(
  client: PublicClient,
  params?: { chainId?: number; contractAddress?: Address },
): Promise<bigint> {
  const address = resolveDistributorAddress(
    params?.chainId ?? client.chain?.id,
    params?.contractAddress,
  )

  return client.readContract({
    address,
    abi: rewardsDistributorAbi,
    functionName: 'mintedSupply',
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
    abi: rewardsDistributorAbi,
    functionName: 'totalRewardsSupply',
  })
}

export async function setRewardsSupplier(
  walletClient: WalletClient,
  publicClient: PublicClient,
  params: {
    rewardsSupplier: Address
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
    recipient: Address
    amount: bigint
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
    distributions: Array<{ recipient: Address; amount: bigint }>
    account: Address
    chainId?: number
    contractAddress?: Address
  },
): Promise<Address[]> {
  const txHashes: Address[] = []

  for (const distribution of params.distributions) {
    const txHash = await mintRewards(walletClient, publicClient, {
      recipient: distribution.recipient,
      amount: distribution.amount,
      account: params.account,
      chainId: params.chainId,
      contractAddress: params.contractAddress,
    })
    txHashes.push(txHash)
  }

  return txHashes
}
