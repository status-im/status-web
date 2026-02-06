import { karmaAirdropAbi } from '../abis/karma-airdrop'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = any

export async function isAirdropClaimed(
  client: AnyClient,
  params: { airdropAddress: `0x${string}`; index: bigint }
): Promise<boolean> {
  return client.readContract({
    address: params.airdropAddress,
    abi: karmaAirdropAbi,
    functionName: 'isClaimed',
    args: [params.index],
  })
}

export async function claimAirdrop(
  walletClient: AnyClient,
  publicClient: AnyClient,
  params: {
    airdropAddress: `0x${string}`
    index: bigint
    account: `0x${string}`
    amount: bigint
    proof: `0x${string}`[]
  }
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
  client: AnyClient,
  params: { airdropAddress: `0x${string}` }
): Promise<`0x${string}`> {
  return client.readContract({
    address: params.airdropAddress,
    abi: karmaAirdropAbi,
    functionName: 'merkleRoot',
  })
}

export async function setAirdropMerkleRoot(
  walletClient: AnyClient,
  publicClient: AnyClient,
  params: {
    airdropAddress: `0x${string}`
    root: `0x${string}`
    account: `0x${string}`
  }
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
  } catch {
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
