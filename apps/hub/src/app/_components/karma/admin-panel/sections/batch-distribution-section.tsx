// Note: all files under /admin-panel are for testing. Please don't review this file
import { Button } from '@status-im/status-network/components'

import { SectionCard } from '../section-card'

type BatchDistributionSectionProps = {
  batchJson: string
  isPending: boolean
  onBatchJsonChange: (value: string) => void
  onSubmit: () => void
}

export function BatchDistributionSection({
  batchJson,
  isPending,
  onBatchJsonChange,
  onSubmit,
}: BatchDistributionSectionProps) {
  return (
    <SectionCard
      title="Optional: Batch Distribute Rewards"
      description="Admin action. Submit multiple mint transactions from a JSON list of recipient and amount."
      className="lg:col-span-2"
    >
      <textarea
        className="mb-2 min-h-28 w-full rounded-8 border border-neutral-20 px-3 py-2 font-mono text-13"
        value={batchJson}
        onChange={e => onBatchJsonChange(e.target.value)}
      />
      <Button
        size="40"
        variant="primary"
        disabled={isPending}
        onClick={onSubmit}
      >
        Run Batch
      </Button>
    </SectionCard>
  )
}
