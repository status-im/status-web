import { karmaAbi } from '../abis/karma'
import { getKarmaAddresses } from './addresses'

import type { Address } from '../types/common'
import type { PublicClient, WalletClient } from 'viem'

function resolveKarmaAddress(
  chainId: number | undefined,
  contractAddress?: Address,
): Address {
  if (contractAddress) return contractAddress
  if (!chainId) throw new Error('Chain ID or contractAddress required')
  return getKarmaAddresses(chainId).karma
}

export async function getKarmaBalance(
  client: PublicClient,
  params: { account: Address; chainId?: number; contractAddress?: Address },
): Promise<bigint> {
  const address = resolveKarmaAddress(
    params.chainId ?? client.chain?.id,
    params.contractAddress,
  )

  return client.readContract({
    address,
    abi: karmaAbi,
    functionName: 'balanceOf',
    args: [params.account],
  })
}

export async function getActualKarmaBalance(
  client: PublicClient,
  params: { account: Address; chainId?: number; contractAddress?: Address },
): Promise<bigint> {
  const address = resolveKarmaAddress(
    params.chainId ?? client.chain?.id,
    params.contractAddress,
  )

  return client.readContract({
    address,
    abi: karmaAbi,
    functionName: 'actualTokenBalanceOf',
    args: [params.account],
  })
}

export async function getKarmaTotalSupply(
  client: PublicClient,
  params?: { chainId?: number; contractAddress?: Address },
): Promise<bigint> {
  const address = resolveKarmaAddress(
    params?.chainId ?? client.chain?.id,
    params?.contractAddress,
  )

  return client.readContract({
    address,
    abi: karmaAbi,
    functionName: 'totalSupply',
  })
}

export async function getRewardDistributors(
  client: PublicClient,
  params?: { chainId?: number; contractAddress?: Address },
): Promise<readonly Address[]> {
  const address = resolveKarmaAddress(
    params?.chainId ?? client.chain?.id,
    params?.contractAddress,
  )

  return client.readContract({
    address,
    abi: karmaAbi,
    functionName: 'getRewardDistributors',
  })
}

export async function setKarmaReward(
  walletClient: WalletClient,
  publicClient: PublicClient,
  params: {
    rewardsDistributor: Address
    amount: bigint
    duration: bigint
    account: Address
    chainId?: number
    contractAddress?: Address
  },
): Promise<Address> {
  const address = resolveKarmaAddress(
    params.chainId ?? walletClient.chain?.id,
    params.contractAddress,
  )

  const { request } = await publicClient.simulateContract({
    address,
    abi: karmaAbi,
    functionName: 'setReward',
    args: [params.rewardsDistributor, params.amount, params.duration],
    account: params.account,
  })

  return walletClient.writeContract(request)
}
