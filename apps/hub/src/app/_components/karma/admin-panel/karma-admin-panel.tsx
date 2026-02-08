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
import { useQuery } from '@tanstack/react-query'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'

import { isAddress, isBytes32, parseBigIntInput } from '~utils/karma-input'

import {
  INITIAL_BATCH_JSON,
  INITIAL_MERKLE_ENTRIES_JSON,
  type RewardSupplyData,
} from './constants'
import { parseBatchDistributions, parseEntriesJson } from './parsers'
import { BatchDistributionSection } from './sections/batch-distribution-section'
import { MerkleGeneratorSection } from './sections/merkle-generator-section'
import { MerkleRootPostingSection } from './sections/merkle-root-posting-section'
import { MintRewardSection } from './sections/mint-reward-section'
import { SetRewardSection } from './sections/set-reward-section'

const DEFAULT_AIRDROP_ADDRESS =
  getKarmaAddresses(KARMA_CHAIN_IDS.STATUS_SEPOLIA).karmaAirdrop ?? ''

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
  const [batchJson, setBatchJson] = useState(INITIAL_BATCH_JSON)
  const [merkleEntriesJson, setMerkleEntriesJson] = useState(
    INITIAL_MERKLE_ENTRIES_JSON
  )
  const [merkleStartIndex, setMerkleStartIndex] = useState('0')
  const [generatedMerkleJson, setGeneratedMerkleJson] = useState('')
  const [merkleJson, setMerkleJson] = useState('')
  const [airdropAddressToPost, setAirdropAddressToPost] = useState(
    DEFAULT_AIRDROP_ADDRESS
  )
  const [merkleRootToPost, setMerkleRootToPost] = useState('')
  const [isPending, setIsPending] = useState(false)

  const { data: supplyData, refetch: refetchSupply } =
    useQuery<RewardSupplyData>({
      queryKey: ['karma-admin-supply'],
      queryFn: async () => {
        if (!publicClient) throw new Error('No public client')
        const [
          availableSupply,
          mintedSupply,
          totalRewardsSupply,
          distributors,
        ] = await Promise.all([
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
    if (!merkleJson.trim()) {
      return {
        tree: null as ReturnType<typeof parseMerkleTreeOutput> | null,
        error: '',
      }
    }

    try {
      return { tree: parseMerkleTreeOutput(merkleJson), error: '' }
    } catch (error) {
      return {
        tree: null,
        error: error instanceof Error ? error.message : 'Invalid merkle JSON',
      }
    }
  }, [merkleJson])

  const rootToPost = parsedMerkle.tree?.root ?? merkleRootToPost

  const requireClients = () => {
    if (!address) throw new Error('Connect wallet first')
    if (!walletClient || !publicClient) {
      throw new Error('Wallet/public client unavailable')
    }
    return { address, walletClient, publicClient }
  }

  const runAction = async (
    action: () => Promise<void>,
    options?: { refetchSupply?: boolean }
  ) => {
    setIsPending(true)
    try {
      await action()
      if (options?.refetchSupply ?? true) {
        await refetchSupply()
      }
    } catch (error) {
      toast.negative(error instanceof Error ? error.message : 'Action failed')
    } finally {
      setIsPending(false)
    }
  }

  const handleSetReward = () =>
    runAction(async () => {
      const clients = requireClients()
      const distributor = rewardDistributor
      if (!isAddress(distributor)) {
        throw new Error('Invalid rewards distributor address')
      }

      const txHash = await setKarmaReward(
        clients.walletClient,
        clients.publicClient,
        {
          account: clients.address,
          rewardsDistributor: distributor,
          amount: parseBigIntInput(rewardAmount, 'Amount'),
          duration: parseBigIntInput(rewardDuration, 'Duration'),
        }
      )

      toast.positive(`Submitted: ${txHash}`)
    })

  const handleMintReward = () =>
    runAction(async () => {
      const clients = requireClients()
      const recipient = mintRecipient
      if (!isAddress(recipient)) {
        throw new Error('Invalid recipient address')
      }

      const txHash = await mintRewards(
        clients.walletClient,
        clients.publicClient,
        {
          account: clients.address,
          recipient,
          amount: parseBigIntInput(mintAmount, 'Amount'),
        }
      )

      toast.positive(`Submitted: ${txHash}`)
    })

  const handleBatchDistribute = () =>
    runAction(async () => {
      const clients = requireClients()
      const distributions = parseBatchDistributions(batchJson)

      const txHashes = await distributeRewardsBatch(
        clients.walletClient,
        clients.publicClient,
        {
          account: clients.address,
          distributions,
        }
      )

      toast.positive(`Submitted ${txHashes.length} tx`)
    })

  const handleGenerateMerkleOutput = () =>
    runAction(
      async () => {
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
        toast.positive('Merkle tree generated')
      },
      { refetchSupply: false }
    )

  const handlePostMerkleRoot = () =>
    runAction(async () => {
      const clients = requireClients()
      const airdropAddress = airdropAddressToPost
      const root = rootToPost

      if (!isAddress(airdropAddress)) {
        throw new Error('Invalid airdrop contract address')
      }
      if (!isBytes32(root)) {
        throw new Error('Invalid merkle root')
      }

      const txHash = await setAirdropMerkleRoot(
        clients.walletClient,
        clients.publicClient,
        {
          airdropAddress,
          root,
          account: clients.address,
        }
      )

      toast.positive(`Root posted: ${txHash}`)
    })

  const merkleSummary = parsedMerkle.tree
    ? `Root: ${parsedMerkle.tree.root}, entries: ${parsedMerkle.tree.entries.length}`
    : parsedMerkle.error || 'Enter valid Merkle JSON'

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
        <SetRewardSection
          rewardDistributor={rewardDistributor}
          rewardAmount={rewardAmount}
          rewardDuration={rewardDuration}
          isPending={isPending}
          onRewardDistributorChange={setRewardDistributor}
          onRewardAmountChange={setRewardAmount}
          onRewardDurationChange={setRewardDuration}
          onSubmit={handleSetReward}
        />

        <MintRewardSection
          mintRecipient={mintRecipient}
          mintAmount={mintAmount}
          isPending={isPending}
          onMintRecipientChange={setMintRecipient}
          onMintAmountChange={setMintAmount}
          onSubmit={handleMintReward}
        />

        <BatchDistributionSection
          batchJson={batchJson}
          isPending={isPending}
          onBatchJsonChange={setBatchJson}
          onSubmit={handleBatchDistribute}
        />

        <MerkleGeneratorSection
          merkleEntriesJson={merkleEntriesJson}
          merkleStartIndex={merkleStartIndex}
          generatedMerkleJson={generatedMerkleJson}
          isPending={isPending}
          onMerkleEntriesJsonChange={setMerkleEntriesJson}
          onMerkleStartIndexChange={setMerkleStartIndex}
          onGenerate={handleGenerateMerkleOutput}
        />

        <MerkleRootPostingSection
          merkleJson={merkleJson}
          parsedMerkleSummary={merkleSummary}
          airdropAddress={airdropAddressToPost}
          rootToPost={rootToPost}
          rootFromParsedMerkle={!!parsedMerkle.tree}
          isPending={isPending}
          onMerkleJsonChange={setMerkleJson}
          onAirdropAddressChange={setAirdropAddressToPost}
          onRootChange={setMerkleRootToPost}
          onSubmit={handlePostMerkleRoot}
        />
      </div>
    </section>
  )
}
