import { Button } from '@status-im/status-network/components'

import { SectionCard } from '../section-card'

type SetRewardSectionProps = {
  rewardDistributor: string
  rewardAmount: string
  rewardDuration: string
  isPending: boolean
  onRewardDistributorChange: (value: string) => void
  onRewardAmountChange: (value: string) => void
  onRewardDurationChange: (value: string) => void
  onSubmit: () => void
}

export function SetRewardSection({
  rewardDistributor,
  rewardAmount,
  rewardDuration,
  isPending,
  onRewardDistributorChange,
  onRewardAmountChange,
  onRewardDurationChange,
  onSubmit,
}: SetRewardSectionProps) {
  return (
    <SectionCard title="Set Reward (Karma)">
      <div className="flex flex-col gap-2">
        <input
          className="rounded-8 border border-neutral-20 px-3 py-2 text-13"
          placeholder="Rewards distributor address"
          value={rewardDistributor}
          onChange={e => onRewardDistributorChange(e.target.value)}
        />
        <input
          className="rounded-8 border border-neutral-20 px-3 py-2 text-13"
          placeholder="Amount (wei)"
          value={rewardAmount}
          onChange={e => onRewardAmountChange(e.target.value)}
        />
        <input
          className="rounded-8 border border-neutral-20 px-3 py-2 text-13"
          placeholder="Duration (seconds)"
          value={rewardDuration}
          onChange={e => onRewardDurationChange(e.target.value)}
        />
        <Button
          size="40"
          variant="primary"
          disabled={isPending}
          onClick={onSubmit}
        >
          Submit
        </Button>
      </div>
    </SectionCard>
  )
}
