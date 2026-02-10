'use client'

import { useMemo, useState } from 'react'

import { useToast } from '@status-im/components'
import {
  claimAirdrop,
  getAirdropMerkleRoot,
  isAirdropClaimed,
  KARMA_CHAIN_IDS,
  parseMerkleTreeOutput,
  verifyMerkleProof,
} from '@status-im/karma-sdk'
import { Button } from '@status-im/status-network/components'
import { useQueryClient } from '@tanstack/react-query'
import { erc20Abi } from 'viem'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'

import { isAddress } from '~utils/karma-input'

type AirdropClaimCardProps = {
  airdropAddress: string
}

const ZERO_BYTES32 =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

const pausableAbi = [
  {
    inputs: [],
    name: 'paused',
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

export function AirdropClaimCard({ airdropAddress }: AirdropClaimCardProps) {
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient({
    chainId: KARMA_CHAIN_IDS.STATUS_SEPOLIA,
  })
  const { data: walletClient } = useWalletClient({
    chainId: KARMA_CHAIN_IDS.STATUS_SEPOLIA,
  })
  const queryClient = useQueryClient()
  const toast = useToast()

  const [merkleJson, setMerkleJson] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [preflightNote, setPreflightNote] = useState('')

  const parsed = useMemo(() => {
    if (!merkleJson.trim()) return { tree: null, error: '' }
    try {
      return { tree: parseMerkleTreeOutput(merkleJson), error: '' }
    } catch (error) {
      return {
        tree: null,
        error: error instanceof Error ? error.message : 'Invalid merkle JSON',
      }
    }
  }, [merkleJson])

  const myEntry = useMemo(() => {
    if (!parsed.tree || !address) return null
    return (
      parsed.tree.entries.find(
        entry => entry.account.toLowerCase() === address.toLowerCase()
      ) ?? null
    )
  }, [parsed.tree, address])

  const handleClaim = async () => {
    if (!isConnected || !address) {
      toast.negative('Connect wallet first')
      return
    }
    if (!publicClient || !walletClient) {
      toast.negative('Wallet client unavailable')
      return
    }
    if (!isAddress(airdropAddress)) {
      toast.negative('Enter a valid airdrop contract address')
      return
    }
    if (!parsed.tree) {
      toast.negative(parsed.error || 'Enter valid merkle JSON')
      return
    }
    if (!myEntry) {
      toast.negative('No merkle entry for connected wallet')
      return
    }

    setPreflightNote('')
    setIsPending(true)
    try {
      const typedAirdropAddress = airdropAddress as `0x${string}`
      const onchainRoot = await getAirdropMerkleRoot(publicClient, {
        airdropAddress: typedAirdropAddress,
      })
      if (onchainRoot.toLowerCase() === ZERO_BYTES32) {
        throw new Error(
          'Merkle root is not set onchain. Complete Step 4 first with owner wallet.'
        )
      }
      if (onchainRoot.toLowerCase() !== parsed.tree.root.toLowerCase()) {
        throw new Error(
          'Merkle root mismatch. Post the root from this JSON in Step 4, then try claim again.'
        )
      }

      const isProofValid = verifyMerkleProof(
        {
          index: myEntry.index,
          account: myEntry.account,
          amount: myEntry.amount,
        },
        myEntry.proof,
        onchainRoot
      )
      if (!isProofValid) {
        throw new Error(
          'Invalid proof for current onchain root. Regenerate Step 3 output and repost root in Step 4.'
        )
      }

      let isPaused: boolean | null = null
      try {
        isPaused = await publicClient.readContract({
          address: typedAirdropAddress,
          abi: pausableAbi,
          functionName: 'paused',
        })
      } catch {
        // Some deployments may not expose paused().
      }
      if (isPaused) {
        throw new Error(
          'Airdrop contract is paused. Call unpause() from owner wallet in Remix, then try claim again.'
        )
      }

      let tokenAddress: `0x${string}` | null = null
      try {
        tokenAddress = await publicClient.readContract({
          address: typedAirdropAddress,
          abi: tokenGetterAbi,
          functionName: 'token',
        })
      } catch {
        try {
          tokenAddress = await publicClient.readContract({
            address: typedAirdropAddress,
            abi: tokenUpperGetterAbi,
            functionName: 'TOKEN',
          })
        } catch {
          setPreflightNote(
            'Token balance pre-check skipped because token()/TOKEN() is unavailable on this contract ABI. If claim fails, verify token funding manually.'
          )
        }
      }

      if (tokenAddress) {
        try {
          const tokenBalance = await publicClient.readContract({
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [typedAirdropAddress],
          })
          if (tokenBalance < myEntry.amount) {
            throw new Error(
              `Airdrop contract token balance is too low. Required: ${myEntry.amount.toString()}, current: ${tokenBalance.toString()}`
            )
          }
        } catch (error) {
          if (error instanceof Error) {
            throw error
          }
          throw new Error('Failed to read token balance for airdrop contract.')
        }
      }

      const alreadyClaimed = await isAirdropClaimed(publicClient, {
        airdropAddress: typedAirdropAddress,
        index: myEntry.index,
      })

      if (alreadyClaimed) {
        toast.negative('Reward already claimed')
        return
      }

      const txHash = await claimAirdrop(walletClient, publicClient, {
        airdropAddress: typedAirdropAddress,
        index: myEntry.index,
        account: myEntry.account,
        amount: myEntry.amount,
        proof: myEntry.proof,
      })

      toast.positive(`Claim submitted: ${txHash}`)
      queryClient.invalidateQueries({ queryKey: ['karma-balance'] })
      queryClient.invalidateQueries({ queryKey: ['karma-rewards-balance'] })
      queryClient.invalidateQueries({ queryKey: ['current-user'] })
    } catch (error) {
      toast.negative(
        error instanceof Error ? error.message : 'Failed to claim rewards'
      )
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="min-h-[200px] w-full overflow-hidden rounded-8 border border-neutral-10 bg-white-100">
      <div className="flex h-full flex-col items-start p-4">
        <div className="flex w-full flex-col gap-0.5">
          <p className="text-15 font-regular text-neutral-50">Karma Airdrop</p>
          <p className="text-13 text-neutral-70">
            Paste the Merkle output JSON from Step 3, then claim from the
            recipient wallet.
          </p>
        </div>

        <div className="mt-2.5 flex w-full flex-col gap-2">
          <textarea
            className="min-h-24 w-full rounded-8 border border-neutral-20 px-3 py-2 font-mono text-13"
            placeholder='{"root":"0x...","entries":[{"index":"0","account":"0x...","amount":"1","proof":["0x..."]}]}'
            value={merkleJson}
            onChange={e => setMerkleJson(e.target.value)}
          />
          {parsed.error ? (
            <span className="text-13 text-danger-50">{parsed.error}</span>
          ) : (
            <span className="text-13 text-neutral-70">
              {myEntry
                ? `Claimable amount: ${myEntry.amount.toString()} (index: ${myEntry.index.toString()}, proof items: ${myEntry.proof.length})`
                : 'No claimable entry detected for connected wallet'}
            </span>
          )}
          {preflightNote ? (
            <span className="text-13 text-neutral-70">{preflightNote}</span>
          ) : null}
          <Button
            variant="primary"
            size="40"
            onClick={handleClaim}
            disabled={isPending || !isConnected}
            className="w-full items-center justify-center"
          >
            {isPending ? 'Claiming...' : 'Claim Airdrop'}
          </Button>
        </div>
      </div>
    </div>
  )
}
