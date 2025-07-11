import { Skeleton } from '@status-im/components'

const CollectibleSkeleton = () => {
  return (
    <div
      aria-busy="true"
      aria-label="Loading collectible"
      className="overflow-auto p-4 pr-3 2xl:p-12"
    >
      <div className="z-30 flex items-center gap-1 py-4">
        <Skeleton
          width={60}
          height={16}
          className="rounded-10"
          variant="secondary"
        />
      </div>

      <div className="mb-10 flex gap-4">
        <div className="flex flex-1 flex-col gap-4">
          <Skeleton
            width={120}
            height={16}
            className="rounded-10"
            variant="secondary"
          />

          <div className="flex gap-2">
            <Skeleton
              width={140}
              height={32}
              className="rounded-10"
              variant="secondary"
            />
            <Skeleton
              width={40}
              height={32}
              className="rounded-10"
              variant="secondary"
            />
          </div>
        </div>
        <Skeleton
          width={140}
          height={140}
          className="aspect-square -translate-y-12 rounded-16"
          variant="secondary"
        />
      </div>

      <div className="-mt-4 grid gap-8">
        <div>
          <Skeleton
            width={80}
            height={16}
            className="mb-2 rounded-10"
            variant="secondary"
          />
          <div className="mb-5 flex flex-col gap-2">
            <Skeleton
              width="100%"
              height={12}
              variant="secondary"
              className="rounded-10"
            />
            <Skeleton
              width="90%"
              height={12}
              variant="secondary"
              className="rounded-10"
            />
            <Skeleton
              width="80%"
              height={12}
              variant="secondary"
              className="rounded-10"
            />
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(155px,1fr))] gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                width="100%"
                height={16}
                variant="secondary"
                className="rounded-10"
              />
            ))}
          </div>
        </div>

        <div className="h-px w-full border-t border-dashed border-neutral-20" />

        <div>
          <Skeleton
            width={60}
            height={16}
            className="mb-3 rounded-10"
            variant="secondary"
          />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(155px,1fr))] gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-1">
                <Skeleton
                  width={80}
                  height={13}
                  variant="secondary"
                  className="rounded-10"
                />
                <Skeleton
                  width={100}
                  height={13}
                  variant="secondary"
                  className="rounded-10"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export { CollectibleSkeleton }
