import { Skeleton } from '@status-im/components'

import { GRADIENTS } from '../../../_constants'

export default function Loading() {
  return (
    <div className="min-h-[calc(100svh-366px)]">
      <div className="grid grid-cols-2 gap-3 overscroll-contain lg:grid-cols-4">
        {GRADIENTS.map((gradient, index) => {
          return (
            <div key={index} className="relative">
              <div
                className="aspect-square h-[calc(100%-36px)] w-full animate-gradient-skeleton rounded-12"
                style={{
                  background: gradient,
                  backgroundSize: '200% 200%',
                }}
              />
              <div className="absolute top-0 aspect-square h-[calc(100%-36px)] w-full rounded-12 bg-blur-white/70" />
              <div className="flex items-center gap-1 py-2">
                <Skeleton
                  height={20}
                  width={20}
                  className="rounded-6"
                  variant="secondary"
                />
                <Skeleton
                  height={20}
                  width={120}
                  className="rounded-6"
                  variant="secondary"
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
