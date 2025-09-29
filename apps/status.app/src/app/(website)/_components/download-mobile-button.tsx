'use client'

import { Button } from '@status-im/components'
import { CloseIcon, DownloadIcon, MobileIcon } from '@status-im/icons/20'
import NextImage from 'next/image'
import { QRCodeSVG } from 'qrcode.react'
import { match } from 'ts-pattern'

import {
  STATUS_MOBILE_APK_URL,
  STATUS_MOBILE_APP_STORE_URL,
  STATUS_MOBILE_F_DROID_URL,
  STATUS_MOBILE_GOOGLE_PLAY_URL,
} from '~/config/routes'
import { trackEvent } from '~app/_utils/track'
import { ScreenImage } from '~components/assets'
import { Dialog } from '~components/dialog'
import { useMobileOperatingSystem } from '~hooks/use-mobile-operating-system'
import appStoreSrc from '~public/images/app-store.png'
import fDroidSrc from '~public/images/f-droid.png'
import googlePlaySrc from '~public/images/google-play.png'
import { useLatestReleaseTags } from '~website/_context/latest-release-tag-context'

import { LatestVersionTag } from './latest-version-tag'

type Props = Pick<React.ComponentProps<typeof Button>, 'variant' | 'size'> & {
  children?: React.ReactElement<React.ComponentProps<typeof Button>>
}

export const DownloadMobileButton = (props: Props) => {
  const mobileOS = useMobileOperatingSystem()
  const latestReleaseTags = useLatestReleaseTags()

  const { children } = props

  const renderLabel = () => {
    return (
      <>
        Download for{' '}
        <span className="hidden macos:contents windows:contents linux:contents unknown:contents">
          mobile
        </span>
        <span className="hidden ios:contents">iOS</span>
        <span className="hidden android:contents">Android</span>
      </>
    )
  }

  return (
    <Dialog>
      {children ?? (
        <Button
          {...props}
          iconBefore={
            <MobileIcon
              className={match(props.variant)
                .with('outline', () => 'text-neutral-100 dark:text-neutral-40')
                .with('grey', () => 'text-neutral-80 dark:text-neutral-50')
                .otherwise(() => undefined)}
            />
          }
        >
          {renderLabel()}
        </Button>
      )}

      <Dialog.Content className="md:!max-w-[1190px]">
        <div className="absolute right-3 top-3 z-10">
          <Dialog.Close>
            <Button
              variant="outline"
              size="32"
              icon={<CloseIcon />}
              aria-label="Close"
            />
          </Dialog.Close>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2">
          <div className="p-12 px-5 md:px-10 xl:px-12">
            <div className="mb-4 flex">
              <LatestVersionTag platform="mobile" />
            </div>
            <Dialog.Title className="mb-2 max-w-[381px] text-40 font-bold">
              Download Status for Mobile
            </Dialog.Title>
            <Dialog.Description className="mb-6 max-w-[468px] pr-12 text-19 font-regular">
              Available for iOS or Android.
            </Dialog.Description>

            <div className="flex h-10 gap-3">
              {mobileOS !== 'android' && (
                <a
                  href={STATUS_MOBILE_APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackEvent('Download', {
                      store: 'app-store',
                      platform: 'ios',
                      version: latestReleaseTags.mobile ?? 'unknown',
                    })
                  }}
                >
                  <NextImage
                    src={appStoreSrc}
                    quality={100}
                    height={40}
                    alt="App Store logo"
                  />
                </a>
              )}
              {mobileOS !== 'ios' && (
                <>
                  <a
                    href={STATUS_MOBILE_GOOGLE_PLAY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackEvent('Download', {
                        store: 'google-play',
                        platform: 'android',
                        version: latestReleaseTags.mobile ?? 'unknown',
                      })
                    }}
                  >
                    <NextImage
                      src={googlePlaySrc}
                      quality={100}
                      height={40}
                      alt="Google Play logo"
                    />
                  </a>
                  <a
                    href={STATUS_MOBILE_F_DROID_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackEvent('Download', {
                        store: 'f-droid',
                        platform: 'android',
                        version: latestReleaseTags.mobile ?? 'unknown',
                      })
                    }}
                  >
                    <NextImage
                      src={fDroidSrc}
                      quality={100}
                      height={40}
                      alt="F-Droid logo"
                    />
                  </a>
                </>
              )}
            </div>

            {mobileOS !== 'ios' && (
              <div className="mt-8 flex flex-col items-start">
                <span className="mb-2 text-13 font-medium text-neutral-50">
                  Other options
                </span>
                <Button
                  variant="outline"
                  iconBefore={<DownloadIcon />}
                  href={STATUS_MOBILE_APK_URL}
                  onClick={() => {
                    trackEvent('Download', {
                      store: 'direct',
                      platform: 'android',
                      version: latestReleaseTags.mobile ?? 'unknown',
                    })
                  }}
                >
                  Download APK file
                </Button>
              </div>
            )}

            {mobileOS === null && (
              <div className="mt-10 flex items-center justify-between gap-4 rounded-20 border border-neutral-30 p-3 pl-6 xl:mr-20 xl:flex-col xl:items-start xl:p-4 xl:pt-3">
                <div>
                  <div className="text-19 font-semibold text-neutral-100">
                    Scan QR to download
                  </div>
                  <div className="text-15 font-regular text-neutral-100">
                    Download our app directly to your phone.
                  </div>
                </div>
                <div className="aspect-square shrink-0 rounded-16 border border-neutral-30 p-2 xl:p-3">
                  <QRCodeSVG
                    value="https://status.app/api/download/mobile"
                    className="size-14 xl:size-20"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="relative overflow-hidden max-xl:h-[30dvh]">
            <div className="absolute left-5 w-3/5 md:left-12 md:w-[calc(50%-60px)] xl:left-0 xl:top-20 xl:w-[316px]">
              <ScreenImage
                id="Non Beta Release/Download/Screen_01:1500:3248"
                alt=""
              />
            </div>
            <div className="absolute left-[calc(60%+40px)] w-1/2 md:left-auto md:right-12 md:w-[calc(50%-60px)] xl:left-[336px] xl:top-20 xl:w-[316px]">
              <ScreenImage
                id="Non Beta Release/Download/Screen_02:1500:3248"
                alt=""
              />
            </div>
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  )
}
