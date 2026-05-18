'use client' // error boundaries must be Client Components

import { useEffect } from 'react'

import { Button } from '@status-im/components'
import { useTranslations } from 'next-intl'

import { Video } from '~components/assets'
import { Body } from '~components/body'
import { NavDesktop } from '~website/_components/navigation/nav-desktop'
import { NavMobile } from '~website/_components/navigation/nav-mobile'

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error }: Props) {
  const t = useTranslations('error')

  useEffect(() => {
    console.error('[ROOT ERROR BOUNDARY]', error)
  }, [error])

  return (
    <>
      {/* simulate the WebsiteLayout without the server side fetching */}
      <NavDesktop />
      <NavMobile />
      <div className="flex flex-1 flex-col overflow-x-clip xl:px-1 xl:pb-1">
        <Body className="flex flex-1 flex-col items-center justify-center gap-8 text-center max-sm:rounded-b-0">
          <div className="z-10 flex flex-col items-center">
            <div className="mb-3 flex flex-col gap-2 py-3">
              <h2 className="text-19 font-semibold 2md:text-27">
                {t('title')}
              </h2>
              <p className="text-15 2md:text-19">{t('description')}</p>
            </div>

            <Button variant="outline" href="/">
              {t('goHome')}
            </Button>
          </div>

          <Video
            id="404 Error/Animations/Error_404:1695:960"
            posterId="404 Error/Frames/Error_404_Frame:1695:960"
            className="absolute left-1/2 z-0 hidden w-full max-w-[1502px] -translate-x-1/2 2md:block 2md:scale-150 xl:scale-[1.2] 2xl:scale-100"
          />

          <Video
            id="404 Error/Animations/Error_404_Mobile:1040:1467"
            posterId="404 Error/Frames/Error_404_Mobile_Frame:1040:1467"
            className="absolute top-1/2 z-0 max-w-[542px] -translate-y-1/2 scale-150 sm:scale-[1.85] 2md:hidden"
          />
        </Body>
      </div>
    </>
  )
}
