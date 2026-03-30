import { Button, Text } from '@status-im/components'
import { ExternalIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'
import { getTranslations } from 'next-intl/server'

import { ROUTES } from '~/config/routes'
import { jsonLD, JSONLDScript } from '~/utils/json-ld'
import { Image, Video } from '~components/assets'
import { Body } from '~components/body'
import { ColorTheme } from '~website/_components/color-theme'
import { findLatestReleasePost, getPosts } from '~website/_lib/ghost'
import { PostGrid } from '~website/blog/_components/post-grid'

import { CopyrightSymbol } from './_components/copyright-symbol'
import { DesktopSection } from './_components/desktop-section'
import { DownloadDesktopButton } from './_components/download-desktop-button'
import { DownloadExtensionButton } from './_components/download-extension-button'
import { DownloadMobileButton } from './_components/download-mobile-button'
import { FeatureList } from './_components/feature-list'
import { FeatureTag } from './_components/feature-tag'
import { HandsSection } from './_components/hands-section'
import { NewsTag } from './_components/news-tag'
import { ParallaxCircle } from './_components/parallax-circle'

import type { FeatureListProps } from './_components/feature-list'

export const revalidate = 3600 // 1 hour

export default async function HomePage() {
  const t = await getTranslations('home')
  const td = await getTranslations('download')

  const { posts: allPosts } = await getPosts({ limit: 10 })
  const releaseResult = findLatestReleasePost(allPosts)
  const posts = allPosts.slice(0, 3)

  const featureList: FeatureListProps['list'] = [
    {
      title: t('openSource'),
      description: t('openSourceDescription'),
      icon: 'Non Beta Release/Icons/10:144:144',
    },
    {
      title: t('decentralised'),
      description: t('decentralisedDescription'),
      icon: 'Non Beta Release/Icons/11:144:144',
    },
    {
      title: t('secure'),
      description: t('secureDescription'),
      icon: 'Non Beta Release/Icons/12:145:144',
    },
    {
      title: t('communityDriven'),
      description: t('communityDrivenDescription'),
      icon: 'Non Beta Release/Icons/13:145:144',
    },
    {
      title: t('permissionless'),
      description: t('permissionlessDescription'),
      icon: 'Non Beta Release/Icons/14:144:144',
    },
    {
      title: t('freeAndAdFree'),
      description: t('freeAndAdFreeDescription'),
      icon: 'Non Beta Release/Icons/15:145:144',
    },
  ]

  const prefooterList = [
    {
      title: t('prefooterManifestoTitle'),
      description: t('prefooterManifestoDescription'),
      link: {
        label: t('prefooterManifestoLink'),
        href: ROUTES.organization[0].href,
      },
    },
    {
      title: t('prefooterSntTitle'),
      description: t('prefooterSntDescription'),
      link: {
        label: t('prefooterSntLink'),
        href: ROUTES.snt[0].href,
      },
    },
    {
      title: t('prefooterNetworkTitle'),
      description: t('prefooterNetworkDescription'),
      link: {
        label: t('prefooterNetworkLink'),
        href: ROUTES.ecosystem[1].href,
      },
    },
  ]

  const organizationSchema = jsonLD.organization({
    description:
      'Private, secure by design. Transact, Message, Browse on your Terms.',
  })

  const websiteSchema = jsonLD.website({
    description:
      'Private, secure by design. Transact, Message, Browse on your Terms.',
  })

  return (
    <>
      <JSONLDScript schema={[organizationSchema, websiteSchema]} />
      {/* HERO */}
      <div
        data-theme="dark"
        className="relative w-full overflow-x-clip bg-neutral-100 pb-8 pt-16 lg:pb-16 lg:pt-24"
      >
        <div className="container mx-auto grid grid-cols-1 gap-8 px-5 xl:grid-cols-2 xl:gap-0">
          <div className="relative z-10 mx-auto flex max-w-[636px] flex-col items-center text-center xl:mx-0 xl:min-w-[640px] xl:items-start xl:text-left">
            <h1 className="mb-4 text-48 font-bold text-white-100 lg:mb-10 lg:text-88">
              {t('heroTitle')
                .split('\n')
                .map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
            </h1>

            <p className="mb-6 max-w-[320px] text-19 font-medium text-white-100 lg:mb-8 lg:max-w-[600px] lg:text-27 lg:font-regular">
              {t('heroDescription')}
            </p>

            <div className="mb-6 flex max-w-full flex-col items-center gap-4 lg:mb-8 xl:items-start">
              <div
                data-theme="dark"
                className={cx(
                  'hidden max-w-full flex-row flex-wrap items-stretch justify-center gap-2 rounded-20 border border-dashed border-neutral-80 p-2',
                  'sm:w-fit sm:flex-nowrap sm:justify-start',
                  'ios:flex android:flex unknown:flex xl:unknown:hidden'
                )}
              >
                <DownloadDesktopButton variant="outline" show="all" />
                <DownloadMobileButton variant="primary" />
              </div>
              <div
                data-theme="dark"
                className={cx(
                  'hidden max-w-full flex-row flex-wrap items-stretch justify-center gap-2 rounded-20 border border-dashed border-neutral-80 p-2',
                  'sm:w-fit sm:flex-nowrap sm:justify-start',
                  'macos:flex windows:flex linux:flex xl:unknown:flex'
                )}
              >
                <DownloadDesktopButton variant="primary" show="all" />
                <DownloadMobileButton variant="outline" />
              </div>
            </div>

            <div className="mb-9 flex max-w-full flex-row items-center gap-3 text-left sm:max-w-[572px] lg:mb-20">
              <p className="text-13 font-medium text-white-100">
                {t('migrateBanner')}
              </p>
              <Button
                size="32"
                variant="darkGrey"
                href="https://status.app/blog/migrate-from-status-legacy-to-unified-status-mobile-app"
                target="_blank"
                rel="noopener noreferrer"
                iconAfter={<ExternalIcon className="text-white-100" />}
              >
                {t('learnMore')}
              </Button>
            </div>

            {releaseResult && <NewsTag post={releaseResult} />}
          </div>

          <div className="relative hidden xl:block">
            <Image
              id="Homepage/Hero/device-mockups:2128:1292"
              alt="Status app showing wallet and messenger on devices"
              width={2128}
              height={1292}
              className="absolute left-0 top-1/2 z-20 ml-[18%] w-[170%] max-w-none translate-y-[-36%]"
            />
          </div>
          <div className="relative mb-[-80px] xl:hidden">
            <Image
              id="Homepage/Hero/device-mockups-mobile:1267:770"
              alt="Status app showing wallet and messenger on devices"
              width={1267}
              height={770}
              className="relative z-20 w-[130%] max-w-none"
            />
          </div>
        </div>
      </div>

      <Body>
        <div className="container relative mx-auto pb-20 lg:pb-40">
          <h2 className="pb-12 pt-40 text-40 font-bold lg:pb-20 lg:text-64">
            {t('builtDifferent')}
          </h2>
          <div className="-ml-5">
            <FeatureList list={featureList} />
          </div>
        </div>
        <div className="relative z-20 w-full">
          <ColorTheme
            theme="yellow"
            className="relative z-20 mb-12 rounded-t-[24px] bg-white-100"
          >
            <div className="absolute -left-40 bottom-0 z-10">
              <ParallaxCircle />
            </div>

            <DesktopSection
              type="wallet"
              title={
                <>
                  {t('walletTitle')
                    .split('\n')
                    .map((line, i) => (
                      <span key={i}>
                        {i > 0 && <br />}
                        {line}
                      </span>
                    ))}
                </>
              }
              description={t('walletDescription')}
              secondary={
                <div className="flex flex-col">
                  <div className="p-4">
                    <p className="text-19 font-semibold">
                      {t('walletBuyTitle')}
                    </p>
                    <div className="flex pt-1">
                      <p className="text-19 font-regular text-neutral-100">
                        {t('walletBuyDescription')}
                      </p>
                    </div>
                  </div>
                  <Image
                    id="Non Beta Release/Icons/Payment_Icons:648:96"
                    alt="Payment method icons including credit card and Apple Pay"
                    width={216}
                    height={32}
                    className="mb-4 ml-4"
                  />
                </div>
              }
              imageId="Platforms/Screens/Desktop Screens/Wallet/Wallet:2880:1800"
              imageAlt="Desktop screenshot showing the wallet feature included in the Status app"
            />
          </ColorTheme>

          <HandsSection />

          <div className="relative inset-x-1/2 top-0 z-10 h-px w-screen -translate-x-1/2 border-t border-dashed border-neutral-30" />
          <ColorTheme theme="purple" className="overflow-hidden py-[68px]">
            <div className="relative mx-auto">
              <div className="absolute bottom-0 left-[-330px] z-10 xl:left-[-350px]">
                <ParallaxCircle />
              </div>
              <DesktopSection
                type="messenger"
                title={
                  <>
                    {t('messengerTitle')
                      .split('\n')
                      .map((line, i) => (
                        <span key={i}>
                          {i > 0 && <br />}
                          {line}
                        </span>
                      ))}
                  </>
                }
                description={t('messengerDescription')}
                secondary={
                  <div className="flex flex-col">
                    <div className="p-4">
                      <p className="text-19 font-semibold">
                        {t('messengerPseudonymTitle')}
                      </p>
                      <div className="flex pt-1">
                        <p className="text-19 font-regular text-neutral-100">
                          {t('messengerPseudonymDescription')}
                        </p>
                      </div>
                    </div>
                  </div>
                }
                imageId="Platforms/Screens/Desktop Screens/Messenger/Messenger:2880:1800"
                imageAlt="Desktop screenshot showing the messenger feature included in the Status app"
              />
            </div>
          </ColorTheme>
        </div>
      </Body>

      <ColorTheme theme="purple">
        <div className="relative z-[-1] mx-auto grid aspect-[0.6] max-w-[1504px] place-content-center place-items-center md:aspect-[0.9] 2md:aspect-[1.33]">
          <div className="absolute -inset-x-10 -top-10 2md:-top-30">
            <Video
              id="Non Beta Release/Animations/Messenger_01_Top:1512:522"
              posterId="Non Beta Release/Animations/Frames/Messenger_01_Top_Frame:1512:522"
              className="w-full"
              isTransparent
            />
          </div>
          <div className="absolute -bottom-30 -left-96 w-[1200px] sm:-bottom-20 md:-inset-x-10 md:-bottom-30 md:w-auto">
            <Video
              id="Non Beta Release/Animations/Messenger_01_Bottom:1512:781"
              posterId="Non Beta Release/Animations/Frames/Messenger_01_Bottom_Frame:1512:781"
              className="w-full"
              isTransparent
            />
          </div>

          <div className="relative z-10 max-w-[700px] px-5 pb-10 text-center md:px-16 md:pb-0 2md:-mb-20">
            <h2 className="mb-1 text-27 font-bold text-white-100">
              {t('metadataTitle')}
            </h2>
            <p className="text-19 text-white-100">{t('metadataDescription')}</p>
          </div>
        </div>
      </ColorTheme>

      <Body>
        <ColorTheme theme="turquoise">
          <div className="relative z-10 size-full pb-[61px] pt-[68px]">
            <div className="absolute bottom-0 left-[-330px] z-10 xl:left-[-350px]">
              <ParallaxCircle />
            </div>

            <DesktopSection
              type="communities"
              title={
                <>
                  {t('communitiesTitle')
                    .split('\n')
                    .map((line, i) => (
                      <span key={i}>
                        {i > 0 && <br />}
                        {line}
                      </span>
                    ))}
                </>
              }
              description={t('communitiesDescription')}
              imageId="Platforms/Screens/Desktop Screens/Communities/Communities:2880:1800"
              imageAlt="Desktop screenshot showing the community feature included in the Status app"
            />
          </div>
        </ColorTheme>
        <div className="relative inset-x-1/2 top-0 z-10 h-px w-screen -translate-x-1/2 border-t border-dashed border-neutral-30" />
        <ColorTheme theme="blue" id="browser">
          <div className="relative z-20 size-full pb-[61px] pt-[68px]">
            <div className="absolute bottom-[200px] left-[-230px] z-10 xl:left-[-350px]">
              <ParallaxCircle />
            </div>

            <div className="relative z-20 mx-auto grid max-w-[1424px] grid-cols-1 overflow-hidden rounded-20 bg-white-100 px-5 shadow-2 xl:grid-cols-2 xl:px-0">
              <div className="p-12 px-5 xl:px-10 xl:pl-12 2xl:pr-28">
                <div className="mb-4 flex">
                  <FeatureTag type="extension" />
                </div>
                <h3 className="mb-2 text-40 font-bold xl:text-64">
                  {t('extensionTitle')
                    .split('\n')
                    .map((line, i) => (
                      <span key={i}>
                        {i > 0 && <br />}
                        {line}
                      </span>
                    ))}
                </h3>
                <p className="mb-20 max-w-[462px] text-19 font-regular xl:mb-44 xl:text-27">
                  {t('extensionDescription')}
                </p>

                <div className="flex flex-col items-start rounded-20 bg-white-20">
                  <DownloadExtensionButton
                    source="homepage-section"
                    variant="primary"
                    size="40"
                  >
                    {td('downloadForChrome')}
                  </DownloadExtensionButton>
                </div>
              </div>
              <Image
                className="max-xl:mb-[-20%] xl:absolute xl:left-[42%] xl:top-[-44%]"
                width={1063}
                height={1195}
                id="Homepage/Screens/Extension Section/Extension_01:2127:2390"
                alt="Status Portfolio Wallet browser extension interface showing portfolio tracking features"
              />
            </div>
          </div>
        </ColorTheme>
        <div className="relative inset-x-1/2 top-0 z-10 h-px w-screen -translate-x-1/2 border-t border-dashed border-neutral-30" />
        <div className="flex flex-col items-center">
          <div
            className={cx([
              'container pb-5',
              'relative flex flex-col-reverse 2md:flex-row',
              '2md:grid-cols-2 2md:items-center 2md:gap-14 lg:gap-12 xl:gap-[102px] 2xl:gap-[140px]',
            ])}
          >
            <div className="absolute inset-x-1/2 top-0 z-20 h-20 w-screen -translate-x-1/2 bg-gradient-to-b from-white-100 to-transparent" />
            {/* Dividers */}

            <div className="absolute inset-x-1/2 top-0 z-10 h-px w-screen -translate-x-1/2 border-t border-dashed border-neutral-30" />
            <div className="absolute inset-x-1/2 bottom-0 z-10 h-px w-screen -translate-x-1/2 border-b border-dashed border-neutral-30" />
            <div className="flex-1">
              <div className="-ml-30 sm:-ml-24 lg:-ml-52 xl:-ml-44 2xl:-ml-60">
                <Video
                  id="Non Beta Release/Animations/Keycard_01:911:720"
                  posterId="Non Beta Release/Animations/Frames/Keycard_01_Frame:456:360"
                  className="w-full min-w-[390px] md:min-w-[613px] 2md:min-w-[386px] lg:min-w-[470px] xl:min-w-[544px] 2xl:min-w-[792px]"
                />
              </div>
            </div>

            <div className="relative z-20 flex flex-1 flex-col items-start gap-8 px-5 py-12 sm:pt-24 2md:pt-10 lg:p-0">
              <div className="flex max-w-none flex-1 flex-col gap-4 lg:gap-5 2xl:max-w-[462px]">
                <div className="flex flex-col">
                  <h2 className="relative inline-block whitespace-nowrap text-40 font-bold lg:text-64">
                    {t('keycardTitle').split('\n')[0]}
                  </h2>
                  <h2 className="relative inline-block whitespace-nowrap text-40 font-bold lg:text-64">
                    {t('keycardTitle').split('\n').slice(1).join(' ')}
                    <span className="inline-block w-3 pt-1 align-top lg:w-4 lg:pt-[9px]">
                      <CopyrightSymbol />
                    </span>
                  </h2>
                </div>

                <Text size={19}>{t('keycardDescription')}</Text>
              </div>
              <Button variant="outline" href="/keycard">
                {t('keycardLink')}
              </Button>
            </div>

            <ParallaxCircle
              color="army"
              className="bottom-[-395px] left-1/2 -translate-x-1/2 lg:left-auto lg:right-[120px] lg:translate-x-0"
            />
          </div>
        </div>

        {/* BLOG */}
        <div className="relative z-30 flex-1 bg-white-100 py-40">
          <div className="container">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-27 font-semibold">{t('blogTitle')}</h3>
              <Button
                variant="outline"
                href={ROUTES.collaborate[2].href}
                size="32"
              >
                {t('blogLink')}
              </Button>
            </div>
            {posts.length > 0 && (
              <PostGrid posts={posts} isLoading={false} hasNextPage={false} />
            )}
          </div>
        </div>

        {/* PRE-FOOTER */}
        <div className="relative z-10 bg-white-100">
          <div className="absolute inset-x-1/2 top-0 z-10 h-px w-screen -translate-x-1/2 border-t border-dashed border-neutral-30" />
          <div className="relative mx-auto max-w-[1264px] overflow-hidden">
            <div className="justify-center divide-y divide-dashed divide-neutral-30 py-12 lg:grid lg:grid-cols-3 lg:divide-x lg:divide-y-0 lg:py-0">
              {prefooterList.map(({ title, description, link }) => (
                <div
                  key={title}
                  className="relative px-5 pb-4 pt-12 2md:px-10 2md:py-16 lg:py-40"
                >
                  <div
                    role="presentation"
                    className="absolute inset-y-0 -left-px hidden h-full w-px bg-gradient-to-t from-white-100 from-5% md:block"
                  />
                  <div className="mb-6 max-w-[400px] gap-1">
                    <h3>
                      <Text size={27} weight="semibold">
                        {title}
                      </Text>
                    </h3>
                    <Text size={19}>{description}</Text>
                  </div>
                  <div className="flex">
                    <Button variant="outline" href={link.href}>
                      {link.label}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* STICKER */}
            <div className="absolute left-[150px] top-[-65px] 2md:left-[423px]">
              <Image
                id="Non Beta Release/Stickers/01:455:455"
                alt="A sticker showing the Status logo"
                aria-hidden
                className="!aspect-square"
                width={152}
                height={152}
              />
            </div>
          </div>
        </div>
      </Body>
    </>
  )
}
