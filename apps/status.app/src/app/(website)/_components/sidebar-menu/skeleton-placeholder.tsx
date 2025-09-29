import { Skeleton } from '@status-im/components'

const SkeletonPlaceholder = () => {
  return (
    <div className="h-full">
      <div className="z-10 py-4">
        <div className="pb-4">
          <div className="mb-[27px]">
            <Skeleton height={12} width={120} className="mb-[19px] rounded-6" />
            <div className="mb-4 flex flex-row items-center">
              <Skeleton
                height={12}
                width={200}
                className="ml-3 rounded-6"
                variant="secondary"
              />
            </div>
            <div className="mb-4 flex flex-row items-center">
              <Skeleton
                height={12}
                width={100}
                className="ml-3 rounded-6"
                variant="secondary"
              />
            </div>
            <div className="mb-4 flex flex-row items-center">
              <Skeleton
                height={12}
                width={130}
                className="ml-3 rounded-6"
                variant="secondary"
              />
            </div>
            <div className="flex flex-row items-center">
              <Skeleton
                height={12}
                width={90}
                className="ml-3 rounded-6"
                variant="secondary"
              />
            </div>
          </div>
          <div>
            <Skeleton height={12} width={50} className="mb-[19px] rounded-6" />
            <div className="mb-4 flex flex-row items-center">
              <Skeleton
                height={12}
                width={120}
                className="ml-3 rounded-6"
                variant="secondary"
              />
            </div>
            <div className="mb-4 flex flex-row items-center">
              <Skeleton
                height={12}
                width={100}
                className="ml-3 rounded-6"
                variant="secondary"
              />
            </div>
            <div className="mb-4 flex flex-row items-center">
              <Skeleton
                height={12}
                width={200}
                className="ml-3 rounded-6"
                variant="secondary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { SkeletonPlaceholder }
