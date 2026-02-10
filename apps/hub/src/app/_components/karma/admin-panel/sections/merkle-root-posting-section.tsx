import { Button } from '@status-im/status-network/components'

import { SectionCard } from '../section-card'

type MerkleRootPostingSectionProps = {
  merkleJson: string
  parsedMerkleSummary: string
  rootToPost: string
  rootFromParsedMerkle: boolean
  isPending: boolean
  onMerkleJsonChange: (value: string) => void
  onRootChange: (value: string) => void
  onSubmit: () => void
}

export function MerkleRootPostingSection({
  merkleJson,
  parsedMerkleSummary,
  rootToPost,
  rootFromParsedMerkle,
  isPending,
  onMerkleJsonChange,
  onRootChange,
  onSubmit,
}: MerkleRootPostingSectionProps) {
  return (
    <SectionCard
      title="Merkle Output Parser & Root Posting"
      className="lg:col-span-2"
    >
      <textarea
        className="mb-2 min-h-28 w-full rounded-8 border border-neutral-20 px-3 py-2 font-mono text-13"
        placeholder='{"root":"0x...","entries":[...]}'
        value={merkleJson}
        onChange={e => onMerkleJsonChange(e.target.value)}
      />
      <p className="text-13 text-neutral-70">{parsedMerkleSummary}</p>
      <input
        className="mt-2 rounded-8 border border-neutral-20 px-3 py-2 text-13"
        placeholder="Merkle root (0x...)"
        value={rootToPost}
        readOnly={rootFromParsedMerkle}
        onChange={e => onRootChange(e.target.value)}
      />
      <Button
        size="40"
        variant="primary"
        disabled={isPending}
        onClick={onSubmit}
      >
        Post Merkle Root Onchain
      </Button>
    </SectionCard>
  )
}
