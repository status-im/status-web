import { Skeleton } from '@status-im/components'

const TokenSkeleton = () => {
  return (
    <div
      aria-busy="true"
      aria-label="Loading token"
      className="grid gap-10 p-4 2xl:p-12"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Skeleton
            width={32}
            height={32}
            className="rounded-full"
            variant="secondary"
          />
          <Skeleton
            width={80}
            height={18}
            variant="secondary"
            className="rounded-10"
          />
        </div>

        <div className="mb-4 flex flex-col gap-2">
          <Skeleton
            width={120}
            height={18}
            variant="secondary"
            className="rounded-10"
          />
          <Skeleton
            width={80}
            height={12}
            variant="secondary"
            className="rounded-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton
            width={80}
            height={32}
            className="rounded-10"
            variant="secondary"
          />
          <Skeleton
            width={80}
            height={32}
            className="rounded-10"
            variant="secondary"
          />
          <Skeleton
            width={80}
            height={32}
            className="rounded-10"
            variant="secondary"
          />
        </div>
      </div>

      <Skeleton
        height={48}
        width="100%"
        className="rounded-12"
        variant="secondary"
      />

      <div className="grid grid-cols-2 gap-y-4 2xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-1 pr-4">
            <Skeleton
              width={80}
              height={14}
              variant="secondary"
              className="rounded-10"
            />
            <Skeleton
              width={100}
              height={18}
              variant="secondary"
              className="rounded-10"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton
          width="60%"
          height={14}
          variant="secondary"
          className="rounded-10"
        />
        <Skeleton
          width="80%"
          height={14}
          variant="secondary"
          className="rounded-10"
        />
        <Skeleton
          width="70%"
          height={14}
          variant="secondary"
          className="rounded-10"
        />
        <Skeleton
          width="50%"
          height={14}
          variant="secondary"
          className="rounded-10"
        />
      </div>
    </div>
  )
}

export { TokenSkeleton }
