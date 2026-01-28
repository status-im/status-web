export type QuotaProgressBarProps = {
  remaining: number
  total: number
  label: string
}

export const QuotaProgressBar = ({
  remaining,
  total,
  label,
}: QuotaProgressBarProps) => {
  const txPercentage = total > 0 ? (remaining / total) * 100 : 0

  const progressBarColor =
    txPercentage < 20
      ? 'bg-danger-50'
      : txPercentage < 50
        ? 'bg-yellow'
        : 'bg-success-50'

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-baseline gap-1.5 sm:flex-row">
        <div className="text-27 font-semibold">
          <span className="text-neutral-100">{remaining.toLocaleString()}</span>
          <span className="text-neutral-40">
            /{total >= 1000 ? `${total / 1000}K` : total}
          </span>
        </div>
        <span className="text-15 font-medium text-neutral-50">{label}</span>
      </div>

      <div className="relative h-2 w-full overflow-hidden rounded-full bg-neutral-10">
        <div
          className={`h-full rounded-full transition-all duration-300 ${progressBarColor}`}
          style={{
            width: `${txPercentage}%`,
          }}
        />
      </div>
    </div>
  )
}
