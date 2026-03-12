// Note: all files under /admin-panel are for testing. Please don't review this file
import { Button } from '@status-im/status-network/components'

import { SectionCard } from '../section-card'

type MerkleGeneratorSectionProps = {
  merkleEntriesJson: string
  merkleStartIndex: string
  generatedMerkleJson: string
  isPending: boolean
  onMerkleEntriesJsonChange: (value: string) => void
  onMerkleStartIndexChange: (value: string) => void
  onGenerate: () => void
}

export function MerkleGeneratorSection({
  merkleEntriesJson,
  merkleStartIndex,
  generatedMerkleJson,
  isPending,
  onMerkleEntriesJsonChange,
  onMerkleStartIndexChange,
  onGenerate,
}: MerkleGeneratorSectionProps) {
  return (
    <SectionCard
      step="Step 3"
      title="Generate Merkle Tree And Proofs"
      description="Paste recipient entries as JSON. Each entry must have account and amount. Start index is usually 0."
      className="lg:col-span-2"
    >
      <textarea
        className="mb-2 min-h-28 w-full rounded-8 border border-neutral-20 px-3 py-2 font-mono text-13"
        placeholder='[{"account":"0x...","amount":"1000000000000000000"}]'
        value={merkleEntriesJson}
        onChange={e => onMerkleEntriesJsonChange(e.target.value)}
      />
      <input
        className="mb-2 rounded-8 border border-neutral-20 px-3 py-2 text-13"
        placeholder="Start index"
        value={merkleStartIndex}
        onChange={e => onMerkleStartIndexChange(e.target.value)}
      />
      <Button
        size="40"
        variant="primary"
        disabled={isPending}
        onClick={onGenerate}
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
    </SectionCard>
  )
}
