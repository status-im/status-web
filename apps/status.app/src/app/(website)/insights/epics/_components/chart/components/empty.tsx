import { Text } from '@status-im/components'
import Image from 'next/image'

import { LineA, LineB } from './assets'

const Empty = () => {
  return (
    <div className="flex size-full flex-col items-center justify-center">
      <div className="relative flex size-full items-center justify-center">
        <div className="relative z-10 flex flex-col items-center justify-center">
          <Image
            alt="No results found"
            src="/assets/chart/empty.png"
            width={80}
            height={80}
          />
          <div className="pb-3" />
          <Text size={15} weight="semibold">
            No results found
          </Text>
          <div className="pb-1" />
          <Text size={13} color="$neutral-50">
            Try adjusting your search or filter to find what you’re looking for.
          </Text>
        </div>
        <div className="absolute left-1/2 top-16 w-full -translate-x-1/2 opacity-[60%]">
          <LineA />
        </div>
        <div className="absolute left-0 top-28 w-full opacity-[60%]">
          <LineB />
        </div>
        <div
          className="absolute left-0 top-0 h-24 w-full"
          style={{
            background: `linear-gradient(180deg, white, transparent)`,
          }}
        />
        <div className="absolute flex size-full justify-between opacity-[80%]">
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
    </div>
  )
}

export { Empty }
