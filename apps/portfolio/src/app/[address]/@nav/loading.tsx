import { Skeleton } from '@status-im/components'

export async function Loading() {
  return (
    <div className="z-20 flex shrink-0 flex-col items-start gap-3 bg-white-100 p-3 transition-all">
      <div className="flex flex-col items-center justify-between gap-3 4xl:hidden">
        <Skeleton height={32} width={32} className="rounded-10" />
        <Skeleton height={32} width={32} className="rounded-10" />
        <Skeleton height={32} width={32} className="rounded-10" />
        <Skeleton height={32} width={32} className="rounded-10" />
      </div>

      <div className="hidden flex-col justify-between gap-3 4xl:flex">
        <Skeleton
          height={32}
          width={244}
          className="rounded-10"
          variant="secondary"
        />
        <Skeleton
          height={32}
          width={244}
          className="rounded-10"
          variant="secondary"
        />
        <Skeleton
          height={32}
          width={244}
          className="rounded-10"
          variant="secondary"
        />
        <div className="flex items-center justify-start gap-2">
          <Skeleton height={32} width={32} className="rounded-10" />
          <Skeleton
            height={20}
            width={96}
            className="rounded-10"
            variant="secondary"
          />
        </div>
      </div>
    </div>
  )
}
