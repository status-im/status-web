import { Skeleton } from '../skeleton'

export const KarmaOverviewCardSkeleton = () => {
  return (
    <div className="flex h-[302px] flex-1 flex-col rounded-20 border border-neutral-20 bg-white-100 shadow-1">
      <div className="flex flex-col gap-3 p-4 pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton height={32} width={280} className="rounded-6" />
            <Skeleton height={16} width={120} className="rounded-6" />
          </div>

          <Skeleton height={32} width={80} className="rounded-6" />
        </div>

        <Skeleton height={68} width="100%" className="rounded-6" />

        <div className="flex items-center gap-1 border-t border-dashed border-neutral-20 pt-3">
          <Skeleton height={28} width={120} className="rounded-6" />
        </div>
      </div>
      <div className="size-full rounded-b-20 bg-neutral-2.5 p-4">
        <Skeleton height={24} width={500} className="rounded-6" />
      </div>
    </div>
  )
}
