import { IconButton } from '@status-im/components'
import { DownloadIcon, RefreshIcon } from '@status-im/icons/12'
import Image from 'next/image'

import type { KarmaVisualData } from '~types/karma'

type KarmaVisualCardProps = KarmaVisualData

const KarmaVisualCard = ({
  imageSrc,
  imageAlt = 'Karma Visual',
  onRefresh,
  onDownload,
}: KarmaVisualCardProps) => {
  return (
    <div className="h-[302px] w-[304px] overflow-hidden rounded-20 border border-neutral-20 bg-white-100 shadow-1">
      <div className="relative size-full p-2">
        <div className="relative size-full overflow-hidden rounded-16">
          <Image src={imageSrc} alt={imageAlt} fill className="object-cover" />
          <div className="absolute bottom-8 right-8 flex gap-2">
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
          </div>
        </div>
      </div>
    </div>
  )
}

export { KarmaVisualCard }
