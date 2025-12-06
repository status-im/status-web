import { Skeleton } from '@status-im/components'
import Image from 'next/image'

import type { KarmaVisualData } from '~types/karma'

type KarmaVisualCardProps = KarmaVisualData

const KarmaVisualCard = ({
  imageSrc,
  imageAlt = 'Karma Visual',
  // onRefresh,
  // onDownload,
  isLoading = false,
}: KarmaVisualCardProps) => {
  if (isLoading) {
    return (
      <div className="aspect-[304/302] w-full max-w-[400px] overflow-hidden rounded-20 border border-neutral-20 bg-white-100 shadow-1 lg:h-[302px] lg:w-[304px]">
        <div className="p-2">
          <Skeleton
            height={286}
            width={288}
            className="rounded-16"
            variant="primary"
          />
        </div>
      </div>
    )
  }
  return (
    <div className="flex aspect-[304/302] w-full max-w-[400px] items-center justify-center overflow-hidden rounded-20 border border-neutral-20 bg-white-100 shadow-1 lg:h-[302px] lg:w-[304px]">
      <div className="relative size-full p-2">
        <div className="relative size-full overflow-hidden rounded-16">
          <Image src={imageSrc} alt={imageAlt} fill className="object-cover" />
          {/* <div className="absolute bottom-8 right-8 flex gap-2">
            <IconButton
              icon={<RefreshIcon />}
              variant="default"
              onClick={onRefresh}
            />
            <IconButton
              icon={<DownloadIcon />}
              variant="default"
              onClick={onDownload}
            />
          </div> */}
        </div>
      </div>
    </div>
  )
}

export { KarmaVisualCard }
