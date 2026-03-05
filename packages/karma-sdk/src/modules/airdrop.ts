import { erc20Abi, parseSignature } from 'viem'

import { karmaAirdropAbi } from '../abis/karma-airdrop'
import {
  ownableOwnerAbi,
  allowMerkleRootUpdateAbi,
  allowMerkleRootUpdateUpperAbi,
  tokenGetterAbi,
  tokenUpperGetterAbi,
  defaultDelegateeGetterAbi,
  defaultDelegateeUpperGetterAbi,
  tokenNoncesAbi,
  pausedAbi,
} from '../abis/common-fragments'

import type { Address, Hash, Hex } from '../types/common'
import type { PublicClient, WalletClient } from 'viem'

const ZERO_BYTES32 =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

export class AirdropModule {
  constructor(
    private getPublicClient: () => PublicClient,
    private getWalletClient: () => WalletClient | null,
  ) {}

  async isClaimed(params: {
    airdropAddress: Address
    index: bigint
  }): Promise<boolean> {
    return this.getPublicClient().readContract({
      address: params.airdropAddress,
      abi: karmaAirdropAbi,
      functionName: 'isClaimed',
      args: [params.index],
    })
  }

  async getMerkleRoot(params: { airdropAddress: Address }): Promise<Hex> {
    return this.getPublicClient().readContract({
      address: params.airdropAddress,
      abi: karmaAirdropAbi,
      functionName: 'merkleRoot',
    })
  }

  async claim(params: {
    airdropAddress: Address
    index: bigint
    account: Address
    amount: bigint
    proof: Hex[]
  }): Promise<Hash> {
    const walletClient = this.requireWalletClient()
    const publicClient = this.getPublicClient()

    try {
      const { request } = await publicClient.simulateContract({
        address: params.airdropAddress,
        abi: karmaAirdropAbi,
        functionName: 'claim',
        args: [params.index, params.account, params.amount, params.proof],
        account: params.account,
      })
      return walletClient.writeContract(request) as Promise<Hash>
    } catch (error) {
      const message =
        error instanceof Error ? error.message.toLowerCase() : ''
      const shouldSkipFallback =
        message.includes('already claimed') ||
        message.includes('invalid proof') ||
        message.includes('token transfer failed') ||
        message.includes('paused')

      if (shouldSkipFallback) throw error

      try {
        return await this.claimWithDelegation(
          walletClient,
          publicClient,
          params,
        )
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

  async setMerkleRoot(params: {
    airdropAddress: Address
    root: Hex
    account: Address
  }): Promise<Hash> {
    const walletClient = this.requireWalletClient()
    const publicClient = this.getPublicClient()

    const [owner, allowUpdate, currentRoot, isPaused] = await Promise.all([
      this.readOwnerIfAvailable(publicClient, params.airdropAddress),
      this.readAllowUpdateIfAvailable(publicClient, params.airdropAddress),
      this.getMerkleRoot({ airdropAddress: params.airdropAddress })
        .then(root => root.toLowerCase())
        .catch(() => null),
      this.readPausedIfAvailable(publicClient, params.airdropAddress),
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
        return walletClient.writeContract(request) as Promise<Hash>
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
        if (message.toLowerCase().includes('user rejected')) throw error
        errors.push(`${functionName}: ${message}`)
      }
    }

    throw new Error(
      `Failed to post merkle root. Tried ${attemptOrder.join(' then ')}. ${errors.join(' | ')}`,
    )
  }

  private async claimWithDelegation(
    walletClient: WalletClient,
    publicClient: PublicClient,
    params: {
      airdropAddress: Address
      index: bigint
      account: Address
      amount: bigint
      proof: Hex[]
    },
  ): Promise<Hash> {
    const tokenAddress = await this.readTokenAddress(
      publicClient,
      params.airdropAddress,
    )
    const defaultDelegatee = await this.readDefaultDelegatee(
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
      message: { delegatee: defaultDelegatee, nonce, expiry },
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

    return walletClient.writeContract(request) as Promise<Hash>
  }

  private async readOwnerIfAvailable(
    client: PublicClient,
    address: Address,
  ): Promise<Address | null> {
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

  private async readAllowUpdateIfAvailable(
    client: PublicClient,
    address: Address,
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

  private async readPausedIfAvailable(
    client: PublicClient,
    address: Address,
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

  private async readTokenAddress(
    client: PublicClient,
    address: Address,
  ): Promise<Address> {
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

  private async readDefaultDelegatee(
    client: PublicClient,
    address: Address,
  ): Promise<Address> {
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

  private requireWalletClient(): WalletClient {
    const wc = this.getWalletClient()
    if (!wc) {
      throw new Error(
        'SDK is in read-only mode. Provide privateKeyOrSigner for write operations.',
      )
    }
    return wc
  }
}
