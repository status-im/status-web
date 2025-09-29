'use client'

import { Text } from '@status-im/components'
import { usePathname } from 'next/navigation'

import { Image } from '~components/assets'

import { DownloadDesktopButton } from './download-desktop-button'

const Prefooter = () => {
  const pathname = usePathname()!

  if (!['/', '/apps'].includes(pathname)) {
    return null
  }

  return (
    <div className="border-b border-dashed border-neutral-80 bg-neutral-100 p-5 py-30 lg:border-0">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center text-center">
          <Image
            id="Brand/Logo Section/Mark/Mark_01:480:480"
            alt=""
            className="size-20"
          />
          <h1 className="py-4 pb-3 pt-5 text-40 font-bold text-white-100 lg:pb-5 lg:text-88">
            Be unstoppable
          </h1>
          <Text size={19} color="$white-100">
            Use the open-source, decentralised wallet and messenger.
          </Text>
          <div className="relative flex w-[237px] flex-col items-center justify-center pt-8 md:w-full">
            <div
              data-theme="dark"
              className="flex w-fit flex-col items-stretch gap-2 rounded-16 border border-dashed border-neutral-80 p-2"
            >
              <DownloadDesktopButton variant="primary" show="all" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Prefooter }
