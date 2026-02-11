// Note: all files under /admin-panel are for testing. Please don't review this file

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
import { useQueryClient } from '@tanstack/react-query'
import { erc20Abi } from 'viem'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'

import { isAddress } from '~utils/karma-input'

import {
  pausableAbi,
  tokenGetterAbi,
  tokenUpperGetterAbi,
  ZERO_BYTES32,
} from './constants'

export function useAirdropClaim(airdropAddress: string) {
  const toast = useToast()
  const queryClient = useQueryClient()
  const { address, isConnected } = useAccount()

  const publicClient = usePublicClient({
    chainId: KARMA_CHAIN_IDS.STATUS_SEPOLIA,
  })

  const { data: walletClient } = useWalletClient({
    chainId: KARMA_CHAIN_IDS.STATUS_SEPOLIA,
  })

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
        console.log('paused not available')
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

  return {
    merkleJson,
    setMerkleJson,
    parsed,
    myEntry,
    isPending,
    isConnected,
    preflightNote,
    handleClaim,
  }
}
