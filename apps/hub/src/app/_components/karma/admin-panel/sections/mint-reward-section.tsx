import { Button } from '@status-im/status-network/components'

import { SectionCard } from '../section-card'

type MintRewardSectionProps = {
  mintRecipient: string
  mintAmount: string
  isPending: boolean
  onMintRecipientChange: (value: string) => void
  onMintAmountChange: (value: string) => void
  onSubmit: () => void
}

export function MintRewardSection({
  mintRecipient,
  mintAmount,
  isPending,
  onMintRecipientChange,
  onMintAmountChange,
  onSubmit,
}: MintRewardSectionProps) {
  return (
    <SectionCard
      title="Optional: Mint Reward"
      description="Admin action. Mint rewards to a recipient address before distribution/claim workflows."
    >
      <div className="flex flex-col gap-2">
        <input
          className="rounded-8 border border-neutral-20 px-3 py-2 text-13"
          placeholder="Recipient address"
          value={mintRecipient}
          onChange={e => onMintRecipientChange(e.target.value)}
        />
        <input
          className="rounded-8 border border-neutral-20 px-3 py-2 text-13"
          placeholder="Amount (wei)"
          value={mintAmount}
          onChange={e => onMintAmountChange(e.target.value)}
        />
        <Button
          size="40"
          variant="primary"
          disabled={isPending}
          onClick={onSubmit}
        >
          Mint
        </Button>
      </div>
    </SectionCard>
  )
}
