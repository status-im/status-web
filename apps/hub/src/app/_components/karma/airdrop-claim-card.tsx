'use client'

import { useMemo, useState } from 'react'

import { useToast } from '@status-im/components'
import {
  claimAirdrop,
  getKarmaAddresses,
  isAirdropClaimed,
  KARMA_CHAIN_IDS,
  parseMerkleTreeOutput,
} from '@status-im/karma-sdk'
import { Button } from '@status-im/status-network/components'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'

function isAddress(value: string): value is `0x${string}` {
  return /^0x[a-fA-F0-9]{40}$/.test(value)
}

export function AirdropClaimCard() {
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient({
    chainId: KARMA_CHAIN_IDS.STATUS_SEPOLIA,
  })
  const { data: walletClient } = useWalletClient({
    chainId: KARMA_CHAIN_IDS.STATUS_SEPOLIA,
  })
  const queryClient = useQueryClient()
  const toast = useToast()

  const defaultAirdropAddress =
    getKarmaAddresses(KARMA_CHAIN_IDS.STATUS_SEPOLIA).karmaAirdrop ?? ''

  const [airdropAddress, setAirdropAddress] = useState(defaultAirdropAddress)
  const [merkleJson, setMerkleJson] = useState('')
  const [isPending, setIsPending] = useState(false)

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

    setIsPending(true)
    try {
      const alreadyClaimed = await isAirdropClaimed(publicClient, {
        airdropAddress,
        index: myEntry.index,
      })

      if (alreadyClaimed) {
        toast.negative('Reward already claimed')
        return
      }

      const txHash = await claimAirdrop(walletClient, publicClient, {
        airdropAddress,
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
    <div className="min-h-[200px] w-full overflow-hidden rounded-20 border border-neutral-10 bg-white-100">
      <div className="flex h-full flex-col items-start p-4">
        <div className="flex w-full flex-col gap-0.5">
          <p className="text-15 font-regular text-neutral-50">Karma Airdrop</p>
          <p className="text-13 text-neutral-70">
            Parse merkle JSON and claim your reward onchain.
          </p>
        </div>

        <div className="mt-2.5 flex w-full flex-col gap-2">
          <input
            className="rounded-8 border border-neutral-20 px-3 py-2 text-13"
            placeholder="Airdrop contract address (0x...)"
            value={airdropAddress}
            onChange={e => setAirdropAddress(e.target.value)}
          />
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
                ? `Claimable amount: ${myEntry.amount.toString()}`
                : 'No claimable entry detected for connected wallet'}
            </span>
          )}
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
