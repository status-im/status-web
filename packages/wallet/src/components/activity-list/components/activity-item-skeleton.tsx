import { Skeleton } from '@status-im/components'

const ActivityItemSkeleton = () => {
  return (
    <div className="grid grid-cols-[2fr_1fr_1fr] gap-4 rounded-12 p-3 transition-colors focus-within:bg-neutral-5 hover:bg-neutral-5">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Skeleton
            width={40}
            height={40}
            className="rounded-full"
            variant="secondary"
          />
          <div className="absolute bottom-[-4px] right-[-4px]">
            <Skeleton
              width={18}
              height={18}
              className="rounded-full border border-white-100"
              variant="secondary"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Skeleton
            width={120}
            height={16}
            variant="secondary"
            className="rounded-10"
          />
          <Skeleton
            width={100}
            height={14}
            variant="secondary"
            className="rounded-10"
          />
        </div>
      </div>

      <div className="flex flex-col items-end justify-center gap-2">
        <Skeleton
          width={80}
          height={16}
          variant="secondary"
          className="rounded-10"
        />
        <Skeleton
          width={60}
          height={14}
          variant="secondary"
          className="rounded-10"
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Skeleton
          width={60}
          height={16}
          variant="secondary"
          className="rounded-10"
        />
        <Skeleton
          width={16}
          height={16}
          className="rounded-10"
          variant="secondary"
        />
      </div>
    </div>
  )
}

export { ActivityItemSkeleton }
