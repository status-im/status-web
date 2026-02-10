import { erc20Abi, parseSignature } from 'viem'

import { karmaAirdropAbi } from '../abis/karma-airdrop'

import type { PublicClient, WalletClient } from 'viem'

const ZERO_BYTES32 =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

const ownableOwnerAbi = [
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

const allowMerkleRootUpdateAbi = [
  {
    inputs: [],
    name: 'allowMerkleRootUpdate',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

const allowMerkleRootUpdateUpperAbi = [
  {
    inputs: [],
    name: 'ALLOW_MERKLE_ROOT_UPDATE',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

const tokenGetterAbi = [
  {
    inputs: [],
    name: 'token',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

const tokenUpperGetterAbi = [
  {
    inputs: [],
    name: 'TOKEN',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

const defaultDelegateeGetterAbi = [
  {
    inputs: [],
    name: 'defaultDelegatee',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

const defaultDelegateeUpperGetterAbi = [
  {
    inputs: [],
    name: 'DEFAULT_DELEGATEE',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

const tokenNoncesAbi = [
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'nonces',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

const pausedAbi = [
  {
    inputs: [],
    name: 'paused',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

async function readOwnerIfAvailable(
  client: PublicClient,
  address: `0x${string}`,
): Promise<`0x${string}` | null> {
  try {
    return await client.readContract({
      address,
      abi: ownableOwnerAbi,
      functionName: 'owner',
    })
  } catch {
    return null
  }
}

async function readAllowUpdateIfAvailable(
  client: PublicClient,
  address: `0x${string}`,
): Promise<boolean | null> {
  try {
    return await client.readContract({
      address,
      abi: allowMerkleRootUpdateAbi,
      functionName: 'allowMerkleRootUpdate',
    })
  } catch {
    try {
      return await client.readContract({
        address,
        abi: allowMerkleRootUpdateUpperAbi,
        functionName: 'ALLOW_MERKLE_ROOT_UPDATE',
      })
    } catch {
      return null
    }
  }
}

async function readPausedIfAvailable(
  client: PublicClient,
  address: `0x${string}`,
): Promise<boolean | null> {
  try {
    return await client.readContract({
      address,
      abi: pausedAbi,
      functionName: 'paused',
    })
  } catch {
    return null
  }
}

async function readTokenAddress(
  client: PublicClient,
  address: `0x${string}`,
): Promise<`0x${string}`> {
  try {
    return await client.readContract({
      address,
      abi: tokenGetterAbi,
      functionName: 'token',
    })
  } catch {
    return client.readContract({
      address,
      abi: tokenUpperGetterAbi,
      functionName: 'TOKEN',
    })
  }
}

async function readDefaultDelegatee(
  client: PublicClient,
  address: `0x${string}`,
): Promise<`0x${string}`> {
  try {
    return await client.readContract({
      address,
      abi: defaultDelegateeGetterAbi,
      functionName: 'defaultDelegatee',
    })
  } catch {
    return client.readContract({
      address,
      abi: defaultDelegateeUpperGetterAbi,
      functionName: 'DEFAULT_DELEGATEE',
    })
  }
}

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
  try {
    const { request } = await publicClient.simulateContract({
      address: params.airdropAddress,
      abi: karmaAirdropAbi,
      functionName: 'claim',
      args: [params.index, params.account, params.amount, params.proof],
      account: params.account,
    })

    return walletClient.writeContract(request)
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : ''
    const shouldSkipFallback =
      message.includes('already claimed') ||
      message.includes('invalid proof') ||
      message.includes('token transfer failed') ||
      message.includes('paused')

    if (shouldSkipFallback) {
      throw error
    }

    try {
      const tokenAddress = await readTokenAddress(
        publicClient,
        params.airdropAddress,
      )
      const defaultDelegatee = await readDefaultDelegatee(
        publicClient,
        params.airdropAddress,
      )
      const [nonce, tokenName, chainId] = await Promise.all([
        publicClient.readContract({
          address: tokenAddress,
          abi: tokenNoncesAbi,
          functionName: 'nonces',
          args: [params.account],
        }),
        publicClient.readContract({
          address: tokenAddress,
          abi: erc20Abi,
          functionName: 'name',
        }),
        publicClient.getChainId(),
      ])

      const expiry = BigInt(Math.floor(Date.now() / 1000) + 3600)
      const signature = await walletClient.signTypedData({
        account: params.account,
        domain: {
          name: tokenName,
          version: '1',
          chainId,
          verifyingContract: tokenAddress,
        },
        types: {
          Delegation: [
            { name: 'delegatee', type: 'address' },
            { name: 'nonce', type: 'uint256' },
            { name: 'expiry', type: 'uint256' },
          ],
        },
        primaryType: 'Delegation',
        message: {
          delegatee: defaultDelegatee,
          nonce,
          expiry,
        },
      })

      const parsed = parseSignature(signature)
      if (parsed.v === undefined) {
        throw new Error('Invalid signature v value')
      }

      const { request } = await publicClient.simulateContract({
        address: params.airdropAddress,
        abi: karmaAirdropAbi,
        functionName: 'claim',
        args: [
          params.index,
          params.account,
          params.amount,
          params.proof,
          nonce,
          expiry,
          Number(parsed.v),
          parsed.r,
          parsed.s,
        ],
        account: params.account,
      })

      return walletClient.writeContract(request)
    } catch (fallbackError) {
      const primaryMessage =
        error instanceof Error ? error.message : 'unknown primary error'
      const fallbackMessage =
        fallbackError instanceof Error
          ? fallbackError.message
          : 'unknown signature-claim fallback error'
      throw new Error(
        `Claim failed for both 4-arg and signature claim paths. 4-arg error: ${primaryMessage}. Signature claim error: ${fallbackMessage}`,
      )
    }
  }
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
  const [owner, allowUpdate, currentRoot, isPaused] = await Promise.all([
    readOwnerIfAvailable(publicClient, params.airdropAddress),
    readAllowUpdateIfAvailable(publicClient, params.airdropAddress),
    getAirdropMerkleRoot(publicClient, {
      airdropAddress: params.airdropAddress,
    })
      .then(root => root.toLowerCase())
      .catch(() => null),
    readPausedIfAvailable(publicClient, params.airdropAddress),
  ])

  if (owner && owner.toLowerCase() !== params.account.toLowerCase()) {
    throw new Error(
      `Connected wallet is not owner. Connected: ${params.account}, owner: ${owner}`,
    )
  }
  if (
    currentRoot &&
    currentRoot !== ZERO_BYTES32 &&
    currentRoot === params.root.toLowerCase()
  ) {
    throw new Error('This merkle root is already set onchain.')
  }

  const hasCurrentRoot =
    !!currentRoot && currentRoot !== ZERO_BYTES32 && currentRoot.length > 2

  if (allowUpdate === false && hasCurrentRoot) {
    throw new Error(
      'Merkle root updates are disabled on this contract after initial root set. Deploy a new contract or use the initial set flow.',
    )
  }

  if (allowUpdate === true && hasCurrentRoot && isPaused === false) {
    throw new Error(
      'This contract requires pause before merkle root update. Connect owner wallet, call pause(), post root, then call unpause().',
    )
  }

  const attemptOrder = ['setMerkleRoot', 'updateMerkleRoot'] as const

  const errors: string[] = []
  for (const functionName of attemptOrder) {
    try {
      const { request } = await publicClient.simulateContract({
        address: params.airdropAddress,
        abi: karmaAirdropAbi,
        functionName,
        args: [params.root],
        account: params.account,
      })
      return walletClient.writeContract(request)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      if (
        message.includes('0x5db8ec57') ||
        message.includes('KarmaAirdrop__MustBePausedToUpdate')
      ) {
        throw new Error(
          'Merkle root update is blocked because contract is not paused. Connect owner wallet, call pause(), post root, then unpause().',
        )
      }
      if (message.toLowerCase().includes('user rejected')) {
        throw error
      }
      errors.push(`${functionName}: ${message}`)
    }
  }

  throw new Error(
    `Failed to post merkle root. Tried ${attemptOrder.join(
      ' then ',
    )}. ${errors.join(' | ')}`,
  )
}
