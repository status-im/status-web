'use client'

import { useMemo, useState } from 'react'

import { useToast } from '@status-im/components'
import {
  buildMerkleTree,
  distributeRewardsBatch,
  getAvailableSupply,
  getKarmaAddresses,
  getMintedSupply,
  getRewardDistributors,
  getTotalRewardsSupply,
  KARMA_CHAIN_IDS,
  mintRewards,
  parseMerkleTreeOutput,
  serializeMerkleTreeOutput,
  setAirdropMerkleRoot,
  setKarmaReward,
} from '@status-im/karma-sdk'
import { Button } from '@status-im/status-network/components'
import { useQuery } from '@tanstack/react-query'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'

function parseBigIntInput(value: string, field: string): bigint {
  if (!value || value.trim() === '') {
    throw new Error(`${field} is required`)
  }
  return BigInt(value.trim())
}

function isAddress(value: string): value is `0x${string}` {
  return /^0x[a-fA-F0-9]{40}$/.test(value)
}

function isBytes32(value: string): value is `0x${string}` {
  return /^0x[a-fA-F0-9]{64}$/.test(value)
}

function parseEntriesJson(raw: string) {
  const parsed = JSON.parse(raw) as Array<{
    account: `0x${string}`
    amount: string
  }>

  return parsed.map((entry, index) => {
    if (!isAddress(entry.account)) {
      throw new Error(`Invalid account at entry ${index}`)
    }
    return {
      account: entry.account,
      amount: parseBigIntInput(entry.amount, `entries[${index}].amount`),
    }
  })
}

export function KarmaAdminPanel() {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient({
    chainId: KARMA_CHAIN_IDS.STATUS_SEPOLIA,
  })
  const publicClient = usePublicClient({
    chainId: KARMA_CHAIN_IDS.STATUS_SEPOLIA,
  })
  const toast = useToast()

  const [rewardDistributor, setRewardDistributor] = useState('')
  const [rewardAmount, setRewardAmount] = useState('')
  const [rewardDuration, setRewardDuration] = useState('')
  const [mintRecipient, setMintRecipient] = useState('')
  const [mintAmount, setMintAmount] = useState('')
  const [batchJson, setBatchJson] = useState(
    '[\n  {"recipient":"0x0000000000000000000000000000000000000000","amount":"1000000000000000000"}\n]'
  )
  const [merkleEntriesJson, setMerkleEntriesJson] = useState(
    '[\n  {"account":"0x0000000000000000000000000000000000000000","amount":"1000000000000000000"}\n]'
  )
  const [merkleStartIndex, setMerkleStartIndex] = useState('0')
  const [generatedMerkleJson, setGeneratedMerkleJson] = useState('')
  const [merkleJson, setMerkleJson] = useState('')
  const [airdropAddressToPost, setAirdropAddressToPost] = useState(
    getKarmaAddresses(KARMA_CHAIN_IDS.STATUS_SEPOLIA).karmaAirdrop ?? ''
  )
  const [merkleRootToPost, setMerkleRootToPost] = useState('')
  const [isPending, setIsPending] = useState(false)

  const { data: supplyData, refetch: refetchSupply } = useQuery({
    queryKey: ['karma-admin-supply'],
    queryFn: async () => {
      if (!publicClient) throw new Error('No public client')
      const [availableSupply, mintedSupply, totalRewardsSupply, distributors] =
        await Promise.all([
          getAvailableSupply(publicClient),
          getMintedSupply(publicClient),
          getTotalRewardsSupply(publicClient),
          getRewardDistributors(publicClient),
        ])
      return {
        availableSupply,
        mintedSupply,
        totalRewardsSupply,
        distributors,
      }
    },
    enabled: !!publicClient,
  })

  const parsedMerkle = useMemo(() => {
    if (!merkleJson.trim()) return null
    try {
      return parseMerkleTreeOutput(merkleJson)
    } catch {
      return null
    }
  }, [merkleJson])

  const generateMerkleTreeOutput = () => {
    const startIndex = parseBigIntInput(merkleStartIndex, 'Start index')
    const parsedEntries = parseEntriesJson(merkleEntriesJson)

    const entries = parsedEntries.map((entry, index) => ({
      index: startIndex + BigInt(index),
      account: entry.account,
      amount: entry.amount,
    }))

    const tree = buildMerkleTree(entries)
    const serialized = serializeMerkleTreeOutput(tree)
    setGeneratedMerkleJson(serialized)
    setMerkleJson(serialized)
    setMerkleRootToPost(tree.root)
  }

  const requireClients = () => {
    if (!address) throw new Error('Connect wallet first')
    if (!walletClient || !publicClient) {
      throw new Error('Wallet/public client unavailable')
    }
    return { address, walletClient, publicClient }
  }

  const runAction = async (action: () => Promise<void>) => {
    setIsPending(true)
    try {
      await action()
      await refetchSupply()
    } catch (error) {
      toast.negative(error instanceof Error ? error.message : 'Action failed')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <section className="rounded-20 border border-neutral-20 bg-white-100 p-4 lg:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-19 font-semibold text-neutral-100">Karma Admin</h3>
        <span className="text-13 text-neutral-50">
          {address ? `Connected: ${address}` : 'Wallet not connected'}
        </span>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-2 text-13 text-neutral-70 lg:grid-cols-2">
        <p>
          Available supply: {supplyData?.availableSupply?.toString() ?? '-'}
        </p>
        <p>Minted supply: {supplyData?.mintedSupply?.toString() ?? '-'}</p>
        <p>
          Total rewards supply:{' '}
          {supplyData?.totalRewardsSupply?.toString() ?? '-'}
        </p>
        <p>Distributors: {supplyData?.distributors?.length ?? 0}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-12 border border-neutral-20 p-3">
          <h4 className="mb-3 text-15 font-semibold text-neutral-100">
            Set Reward (Karma)
          </h4>
          <div className="flex flex-col gap-2">
            <input
              className="rounded-8 border border-neutral-20 px-3 py-2 text-13"
              placeholder="Rewards distributor address"
              value={rewardDistributor}
              onChange={e => setRewardDistributor(e.target.value)}
            />
            <input
              className="rounded-8 border border-neutral-20 px-3 py-2 text-13"
              placeholder="Amount (wei)"
              value={rewardAmount}
              onChange={e => setRewardAmount(e.target.value)}
            />
            <input
              className="rounded-8 border border-neutral-20 px-3 py-2 text-13"
              placeholder="Duration (seconds)"
              value={rewardDuration}
              onChange={e => setRewardDuration(e.target.value)}
            />
            <Button
              size="40"
              variant="primary"
              disabled={isPending}
              onClick={() =>
                runAction(async () => {
                  const clients = requireClients()
                  const txHash = await setKarmaReward(
                    clients.walletClient,
                    clients.publicClient,
                    {
                      account: clients.address,
                      rewardsDistributor: rewardDistributor as `0x${string}`,
                      amount: parseBigIntInput(rewardAmount, 'Amount'),
                      duration: parseBigIntInput(rewardDuration, 'Duration'),
                    }
                  )
                  toast.positive(`Submitted: ${txHash}`)
                })
              }
            >
              Submit
            </Button>
          </div>
        </div>

        <div className="rounded-12 border border-neutral-20 p-3">
          <h4 className="mb-3 text-15 font-semibold text-neutral-100">
            Mint Reward
          </h4>
          <div className="flex flex-col gap-2">
            <input
              className="rounded-8 border border-neutral-20 px-3 py-2 text-13"
              placeholder="Recipient address"
              value={mintRecipient}
              onChange={e => setMintRecipient(e.target.value)}
            />
            <input
              className="rounded-8 border border-neutral-20 px-3 py-2 text-13"
              placeholder="Amount (wei)"
              value={mintAmount}
              onChange={e => setMintAmount(e.target.value)}
            />
            <Button
              size="40"
              variant="primary"
              disabled={isPending}
              onClick={() =>
                runAction(async () => {
                  const clients = requireClients()
                  const txHash = await mintRewards(
                    clients.walletClient,
                    clients.publicClient,
                    {
                      account: clients.address,
                      recipient: mintRecipient as `0x${string}`,
                      amount: parseBigIntInput(mintAmount, 'Amount'),
                    }
                  )
                  toast.positive(`Submitted: ${txHash}`)
                })
              }
            >
              Mint
            </Button>
          </div>
        </div>

        <div className="rounded-12 border border-neutral-20 p-3 lg:col-span-2">
          <h4 className="mb-3 text-15 font-semibold text-neutral-100">
            Batch Distribute Rewards
          </h4>
          <textarea
            className="mb-2 min-h-28 w-full rounded-8 border border-neutral-20 px-3 py-2 font-mono text-13"
            value={batchJson}
            onChange={e => setBatchJson(e.target.value)}
          />
          <Button
            size="40"
            variant="primary"
            disabled={isPending}
            onClick={() =>
              runAction(async () => {
                const clients = requireClients()
                const parsed = JSON.parse(batchJson) as Array<{
                  recipient: `0x${string}`
                  amount: string
                }>
                const txHashes = await distributeRewardsBatch(
                  clients.walletClient,
                  clients.publicClient,
                  {
                    account: clients.address,
                    distributions: parsed.map(item => ({
                      recipient: item.recipient,
                      amount: BigInt(item.amount),
                    })),
                  }
                )
                toast.positive(`Submitted ${txHashes.length} tx`)
              })
            }
          >
            Run Batch
          </Button>
        </div>

        <div className="rounded-12 border border-neutral-20 p-3 lg:col-span-2">
          <h4 className="mb-3 text-15 font-semibold text-neutral-100">
            Merkle Tree Generator
          </h4>
          <textarea
            className="mb-2 min-h-28 w-full rounded-8 border border-neutral-20 px-3 py-2 font-mono text-13"
            placeholder='[{"account":"0x...","amount":"1000000000000000000"}]'
            value={merkleEntriesJson}
            onChange={e => setMerkleEntriesJson(e.target.value)}
          />
          <input
            className="mb-2 rounded-8 border border-neutral-20 px-3 py-2 text-13"
            placeholder="Start index"
            value={merkleStartIndex}
            onChange={e => setMerkleStartIndex(e.target.value)}
          />
          <Button
            size="40"
            variant="primary"
            disabled={isPending}
            onClick={() =>
              runAction(async () => {
                generateMerkleTreeOutput()
                toast.positive('Merkle tree generated')
              })
            }
          >
            Generate Merkle Output
          </Button>
          {generatedMerkleJson ? (
            <textarea
              className="mt-2 min-h-28 w-full rounded-8 border border-neutral-20 px-3 py-2 font-mono text-13"
              value={generatedMerkleJson}
              readOnly
            />
          ) : null}
        </div>

        <div className="rounded-12 border border-neutral-20 p-3 lg:col-span-2">
          <h4 className="mb-3 text-15 font-semibold text-neutral-100">
            Merkle Output Parser & Root Posting
          </h4>
          <textarea
            className="mb-2 min-h-28 w-full rounded-8 border border-neutral-20 px-3 py-2 font-mono text-13"
            placeholder='{"root":"0x...","entries":[...]}'
            value={merkleJson}
            onChange={e => setMerkleJson(e.target.value)}
          />
          <p className="text-13 text-neutral-70">
            {parsedMerkle
              ? `Root: ${parsedMerkle.root}, entries: ${parsedMerkle.entries.length}`
              : 'Enter valid Merkle JSON'}
          </p>
          <input
            className="mt-2 rounded-8 border border-neutral-20 px-3 py-2 text-13"
            placeholder="Airdrop contract address"
            value={airdropAddressToPost}
            onChange={e => setAirdropAddressToPost(e.target.value)}
          />
          <input
            className="mt-2 rounded-8 border border-neutral-20 px-3 py-2 text-13"
            placeholder="Merkle root (0x...)"
            value={parsedMerkle?.root ?? merkleRootToPost}
            readOnly={!!parsedMerkle}
            onChange={e => setMerkleRootToPost(e.target.value)}
          />
          <Button
            size="40"
            variant="primary"
            disabled={isPending}
            onClick={() =>
              runAction(async () => {
                const clients = requireClients()
                if (!isAddress(airdropAddressToPost)) {
                  throw new Error('Invalid airdrop contract address')
                }
                if (!isBytes32(merkleRootToPost)) {
                  throw new Error('Invalid merkle root')
                }
                const txHash = await setAirdropMerkleRoot(
                  clients.walletClient,
                  clients.publicClient,
                  {
                    airdropAddress: airdropAddressToPost,
                    root: merkleRootToPost,
                    account: clients.address,
                  }
                )
                toast.positive(`Root posted: ${txHash}`)
              })
            }
          >
            Post Merkle Root Onchain
          </Button>
        </div>
      </div>
    </section>
  )
}
