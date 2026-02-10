import { karmaAirdropAbi } from '../abis/karma-airdrop'

import type { PublicClient, WalletClient } from 'viem'

export async function isAirdropClaimed(
  client: PublicClient,
  params: { airdropAddress: `0x${string}`; index: bigint },
): Promise<boolean> {
  return client.readContract({
    address: params.airdropAddress,
    abi: karmaAirdropAbi,
    functionName: 'isClaimed',
    args: [params.index],
  })
}

export async function claimAirdrop(
  walletClient: WalletClient,
  publicClient: PublicClient,
  params: {
    airdropAddress: `0x${string}`
    index: bigint
    account: `0x${string}`
    amount: bigint
    proof: `0x${string}`[]
  },
): Promise<`0x${string}`> {
  const { request } = await publicClient.simulateContract({
    address: params.airdropAddress,
    abi: karmaAirdropAbi,
    functionName: 'claim',
    args: [params.index, params.account, params.amount, params.proof],
    account: params.account,
  })

  return walletClient.writeContract(request)
}

export async function getAirdropMerkleRoot(
  client: PublicClient,
  params: { airdropAddress: `0x${string}` },
): Promise<`0x${string}`> {
  return client.readContract({
    address: params.airdropAddress,
    abi: karmaAirdropAbi,
    functionName: 'merkleRoot',
  })
}

export async function setAirdropMerkleRoot(
  walletClient: WalletClient,
  publicClient: PublicClient,
  params: {
    airdropAddress: `0x${string}`
    root: `0x${string}`
    account: `0x${string}`
  },
): Promise<`0x${string}`> {
  try {
    const { request } = await publicClient.simulateContract({
      address: params.airdropAddress,
      abi: karmaAirdropAbi,
      functionName: 'setMerkleRoot',
      args: [params.root],
      account: params.account,
    })
    return walletClient.writeContract(request)
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : ''
    const isMissingSelector =
      message.includes('function') &&
      (message.includes('does not exist') ||
        message.includes('not found') ||
        message.includes('no matching') ||
        message.includes('unknown selector'))

    if (!isMissingSelector) {
      throw error
    }

    const { request } = await publicClient.simulateContract({
      address: params.airdropAddress,
      abi: karmaAirdropAbi,
      functionName: 'updateMerkleRoot',
      args: [params.root],
      account: params.account,
    })
    return walletClient.writeContract(request)
  }
}
