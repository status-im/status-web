import { Skeleton } from '@status-im/components'

const Loading = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="relative flex h-full w-full">
        <div
          className="absolute left-0 top-0 h-24 w-full"
          style={{
            background: `linear-gradient(180deg, white, transparent)`,
          }}
        />
        <div className="flex h-full w-10 flex-col justify-between ">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} width={20} height={12} />
          ))}
        </div>
        <div className="flex h-full w-full justify-between">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              className="h-full w-1"
              style={{
                borderLeft: '1px dashed #F0F2F5',
              }}
              key={i}
            />
          ))}
        </div>
      </div>
      <div className="flex  w-full flex-row justify-between pl-9">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} width={32} height={12} />
        ))}
      </div>
    </div>
  )
}

export { Loading }
