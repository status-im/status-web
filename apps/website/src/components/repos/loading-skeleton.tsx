import { Shadow, Skeleton } from '@status-im/components'

const LoadingSkeleton = () => {
  return (
    <div className="grid  grid-cols-3 gap-5 p-10">
      {[...Array(6)].map((_, index) => (
        <Shadow key={index}>
          <div className="flex h-[124px] flex-col justify-between rounded-2xl border border-neutral-10 px-4 py-3 ">
            <Skeleton height={12} width={120} borderRadius="$6" />
            <Skeleton height={12} width={220} borderRadius="$6" />
            <div className="flex flex-row items-center gap-3">
              <Skeleton
                height={12}
                width={40}
                borderRadius="$6"
                variant="secondary"
              />
              <Skeleton
                height={12}
                width={40}
                borderRadius="$6"
                variant="secondary"
              />
              <Skeleton
                height={12}
                width={40}
                borderRadius="$6"
                variant="secondary"
              />
            </div>
          </div>
        </Shadow>
      ))}
    </div>
  )
}

export { LoadingSkeleton }
