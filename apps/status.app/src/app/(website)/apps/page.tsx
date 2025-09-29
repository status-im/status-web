import { Tabs, Tag } from '@status-im/components'
import { DesktopIcon, MobileIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'

import { Metadata } from '~app/_metadata'
import { Image, ScreenImage } from '~components/assets'
import { Body } from '~components/body'
import { DownloadDesktopButton } from '~website/_components/download-desktop-button'
import { DownloadMobileButton } from '~website/_components/download-mobile-button'
import { FeatureList } from '~website/_components/feature-list'
import { LatestVersionTag } from '~website/_components/latest-version-tag'
import { ParallaxCircle } from '~website/_components/parallax-circle'

import { HeroSection } from '../_components/hero-section'
import { CenteredDiv } from './_components/centered-div'
import { ConnectorSection } from './_components/connector-section'

import type { ImageType } from '~components/assets'
import type { FeatureListProps } from '~website/_components/feature-list'

export const metadata = Metadata({
  title: 'Apps',
  description:
    'Use Status on the go with our mobile app or enjoy the full suite of features in our desktop version.',
})

export default function AppsPage() {
  return (
    <Body>
      <div className="relative">
        <HeroSection
          tag={
            <>
              <Tag
                size="32"
                icon={<MobileIcon className="text-neutral-100" />}
              />
              <Tag
                size="32"
                icon={<DesktopIcon className="text-neutral-100" />}
              />
            </>
          }
          title="Enjoy the Status apps"
          description="Use Status on the go with our mobile app or enjoy the full suite of features in our desktop version."
          action={
            <>
              <div
                className={cx(
                  'hidden w-full flex-col items-stretch gap-2 rounded-16 border border-dashed border-neutral-80/20 p-2',
                  'md:w-fit md:flex-row md:items-center',
                  'ios:flex android:flex unknown:flex xl:unknown:hidden'
                )}
              >
                <DownloadMobileButton />
                <DownloadDesktopButton variant="outline" />
              </div>
              <div
                className={cx(
                  'hidden w-full flex-col items-stretch gap-2 rounded-16 border border-dashed border-neutral-80/20 p-2',
                  'md:w-fit md:flex-row md:items-center',
                  'macos:flex windows:flex linux:flex xl:unknown:flex'
                )}
              >
                <DownloadDesktopButton />
                <DownloadMobileButton variant="outline" />
              </div>
            </>
          }
          video={{
            id: 'Platforms/Animations/Platforms_Hero:717:572',
            posterId:
              'Platforms/Animations/Frames/Platforms_Hero_Frame:717:572',
          }}
          circle={
            <div className="left-[-358px] top-[-274px] z-10 block xl:hidden">
              <ParallaxCircle color="army" />
            </div>
          }
          reverse
          className="xl:pb-40"
        />
      </div>

      {/* MOBILE */}
      <div className="relative z-20 mb-24 bg-white-100 2xl:mb-40">
        <ParallaxCircle
          color="turquoise"
          className="top-[184px] hidden xl:left-[70px] xl:block"
        />
        <ParallaxCircle
          color="camel"
          className="bottom-[-40px] hidden xl:right-[-88px] xl:block"
        />
        <PlatformSection
          platform="mobile"
          title="Status for mobile"
          showScribble
          screenshots={[
            {
              label: 'Wallet',
              images: [
                {
                  id: 'Platforms/Screens/Mobile Screens/Wallet/Wallet_01:750:1624',
                  alt: 'Mobile app screenshot showing the wallet feature included in the Status app',
                },
                {
                  id: 'Platforms/Screens/Mobile Screens/Wallet/Wallet_02:750:1624',
                  alt: 'Mobile app screenshot showing the wallet feature included in the Status app',
                },
                {
                  id: 'Platforms/Screens/Mobile Screens/Wallet/Wallet_03:750:1624',
                  alt: 'Mobile app screenshot showing the wallet feature included in the Status app',
                },
              ],
            },
            {
              label: 'Messenger',
              images: [
                {
                  id: 'Platforms/Screens/Mobile Screens/Messenger/Messenger_01:750:1624',
                  alt: 'Mobile app screenshot showing the messenger feature included in the Status app',
                },
                {
                  id: 'Platforms/Screens/Mobile Screens/Messenger/Messenger_02:750:1624',
                  alt: 'Mobile app screenshot showing the messenger feature included in the Status app',
                },
                {
                  id: 'Platforms/Screens/Mobile Screens/Messenger/Messenger_03:750:1624',
                  alt: 'Mobile app screenshot showing the messenger feature included in the Status app',
                },
              ],
            },
            {
              label: 'Communities',
              images: [
                {
                  id: 'Platforms/Screens/Mobile Screens/Communities/Communities_01:750:1624',
                  alt: 'Mobile app screenshot showing the community feature included in the Status app',
                },
                {
                  id: 'Platforms/Screens/Mobile Screens/Communities/Communities_02:750:1624',
                  alt: 'Mobile app screenshot showing the community feature included in the Status app',
                },
                {
                  id: 'Platforms/Screens/Mobile Screens/Communities/Communities_03:750:1624',
                  alt: 'Mobile app screenshot showing the community feature included in the Status app',
                },
              ],
            },
          ]}
          wideScreenshots={false}
        />
      </div>

      {/* DESKTOP */}
      <div className="relative z-20 mb-24 bg-white-100 2xl:mb-30">
        <ParallaxCircle
          color="sky"
          className="bottom-[-40px] hidden xl:right-[-88px] xl:block"
        />
        <ParallaxCircle
          color="camel"
          className="left-[-346px] top-[124px] block xl:hidden"
        />
        <PlatformSection
          platform="desktop"
          title="Status for desktop"
          screenshots={[
            {
              label: 'Wallet',
              images: [
                {
                  id: 'Platforms/Screens/Desktop Screens/Wallet/Wallet:2880:1800',
                  alt: 'Desktop screenshot showing the wallet feature included in the Status app',
                },
              ],
            },
            {
              label: 'Messenger',
              images: [
                {
                  id: 'Platforms/Screens/Desktop Screens/Messenger/Messenger:2880:1800',
                  alt: 'Desktop screenshot showing the messenger feature included in the Status app',
                },
              ],
            },
            {
              label: 'Communities',
              images: [
                {
                  id: 'Platforms/Screens/Desktop Screens/Communities/Communities:2880:1800',
                  alt: 'Desktop screenshot showing the community feature included in the Status app',
                },
              ],
            },
          ]}
          featureList={DESKTOP_FEATURE_LIST}
        />
      </div>

      <div className="container mb-40">
        <ConnectorSection />
      </div>
    </Body>
  )
}

type PlatformSectionProps = {
  platform: 'mobile' | 'desktop'
  title: string
  screenshots: Array<{
    label: string
    images: ImageType[]
  }>
  featureList?: FeatureListProps['list']
  showScribble?: boolean
  wideScreenshots?: boolean
}

const PlatformSection = (props: PlatformSectionProps) => {
  const {
    platform,
    title,

    screenshots,
    featureList,
    showScribble,
    wideScreenshots = true,
  } = props

  return (
    <div className="border-dashed-default relative border-t pt-24 2xl:pt-40">
      <div className="container mb-12 2xl:mb-20">
        <div className="mb-4 flex items-start gap-2">
          <LatestVersionTag platform={platform} />
        </div>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <h3
            id={platform}
            className="scroll-mt-40 text-40 font-bold 2xl:text-64"
          >
            {title}
          </h3>
          {platform === 'mobile' && <DownloadMobileButton variant="outline" />}
          {platform === 'desktop' && (
            <DownloadDesktopButton show="all" variant="outline" />
          )}
        </div>
      </div>

      <Tabs.Root defaultValue={screenshots[0]!.label} variant="grey" size="32">
        <CenteredDiv
          className={cx([
            'mx-auto flex w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden scrollbar-none xl:overflow-visible',
            wideScreenshots ? 'max-w-[1464px]' : 'max-w-[1294px]',
          ])}
        >
          {wideScreenshots ? (
            screenshots.map(({ label, images }) => (
              <Tabs.Content key={label} value={label}>
                <div className="px-5">
                  {images.map(image => (
                    <ScreenImage
                      key={image.id}
                      {...image}
                      className="min-w-[calc(100%-20px)] overflow-hidden rounded-8 md:rounded-[24px]"
                    />
                  ))}
                </div>
              </Tabs.Content>
            ))
          ) : (
            <div>
              {screenshots.map(({ label, images }) => (
                <Tabs.Content
                  key={label}
                  value={label}
                  className="flex gap-4 px-5 2xl:gap-12"
                >
                  {images.map(image => (
                    <ScreenImage
                      key={image.id}
                      {...image}
                      className="min-w-[244px] rounded-16 md:rounded-[24px]"
                    />
                  ))}
                </Tabs.Content>
              ))}
            </div>
          )}
        </CenteredDiv>

        <div className="pt-10">
          <div className="overflow-x-scroll scrollbar-none xl:overflow-x-visible">
            <div className="relative mx-5 flex lg:justify-center">
              <Tabs.List>
                {screenshots.map(({ label }) => (
                  <Tabs.Trigger key={label} value={label}>
                    {label}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
              {showScribble && (
                <Image
                  id="Platforms/Scribbles and Notes/Screen Section/Scribble_01:385:162"
                  alt=""
                  aria-hidden
                  className="absolute inset-auto -bottom-14 hidden xl:block"
                  width={90}
                  height={38}
                />
              )}
            </div>
          </div>
        </div>
      </Tabs.Root>

      {featureList && (
        <div className="pt-12 xl:pt-30">
          <FeatureList list={featureList} />
        </div>
      )}
    </div>
  )
}

const DESKTOP_FEATURE_LIST: FeatureListProps['list'] = [
  {
    title: 'Create your Community',
    description:
      'Use Status Desktop to create Communities, run control nodes and administer your Community.',
    icon: 'Platforms/Icons/Icon Section/01_Create_Your_Community:144:144',
  },
  {
    title: 'Support p2p messaging',
    description:
      'By running Status Desktop you contribute to keeping Status’ Waku p2p messaging network decentralised.',
    icon: 'Platforms/Icons/Icon Section/02_Support_p2p_Messaging:145:144',
  },
  {
    title: 'Full suite of features',
    description:
      'Status Desktop contains the full suite of Status features - everything you can do in Status Mobile and more.',
    icon: 'Platforms/Icons/Icon Section/03_Full_Suite_of_Apps:145:144',
  },
]
