'use client'

interface VaultCardProps {
  name: string
  apy: string
  rewards: string[]
  icon: string
  onDeposit: () => void
}

export function VaultCard({
  name,
  apy,
  rewards,
  icon,
  onDeposit,
}: VaultCardProps) {
  return (
    <div className="rounded-16 border border-neutral-20 bg-white-100 p-5 shadow-1">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex size-10 items-center justify-center rounded-full bg-purple">
              <span className="font-bold text-white-100">{icon.charAt(0)}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full border-2 border-neutral-5 bg-white-100">
              <span className="text-13 font-bold text-purple">S</span>
            </div>
          </div>
          <div>
            <h4 className="text-19 font-semibold text-neutral-90">{name}</h4>
            <p className="text-13 text-neutral-60">APY: {apy}</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="mb-2 text-13 text-neutral-60">Rewards:</p>
        <div className="flex flex-wrap gap-1.5">
          {rewards.map((reward, index) => (
            <span
              key={index}
              className="rounded-full bg-customisation-purple-50/10 px-2 py-0.5 text-13 font-medium text-purple"
            >
              {reward}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={onDeposit}
        className="w-full rounded-16 bg-purple px-3 py-2.5 text-13 font-medium text-white-100 transition-colors hover:bg-purple-dark"
      >
        Deposit
      </button>
    </div>
  )
}
