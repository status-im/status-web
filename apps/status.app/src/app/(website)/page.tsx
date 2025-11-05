import { Button, Text } from '@status-im/components'
import { cx } from 'class-variance-authority'

import { ROUTES } from '~/config/routes'
import { Image, Video } from '~components/assets'
import { Body } from '~components/body'
import { ColorTheme } from '~website/_components/color-theme'
import { getPosts } from '~website/_lib/ghost'
import { PostGrid } from '~website/blog/_components/post-grid'

import { CopyrightSymbol } from './_components/copyright-symbol'
import { DesktopSection } from './_components/desktop-section'
import { DownloadDesktopButton } from './_components/download-desktop-button'
import { DownloadExtensionButton } from './_components/download-extension-button'
import { FeatureList } from './_components/feature-list'
import { FeatureTag } from './_components/feature-tag'
import { HandsSection } from './_components/hands-section'
import { ParallaxCircle } from './_components/parallax-circle'

import type { FeatureListProps } from './_components/feature-list'

export const revalidate = 3600 // 1 hour

export default async function HomePage() {
  const { posts } = await getPosts({ limit: 3 })

  return (
    <>
      <div className="relative flex w-full justify-center">
        <Image
          id="Non Beta Release/Illustrations/hero-1:930:1424"
          alt=""
          aria-hidden
          width={465}
          height={712}
          className="absolute top-0 z-10 hidden xl:left-[-150px] xl:block 2xl:left-[-75px] 3xl:left-0"
          priority
        />
        <Image
          id="Non Beta Release/Illustrations/hero-2:950:1424"
          alt=""
          aria-hidden
          width={475}
          height={712}
          className="absolute top-0 z-10 hidden xl:right-[-150px] xl:block 2xl:right-[-75px] 3xl:right-0"
          priority
        />
        {/* HERO */}
        <div
          data-theme="dark"
          className="flex flex-col items-center bg-neutral-100 px-5 pb-[386px] pt-16 lg:pt-44 xl:pb-24"
        >
          <div className="relative z-20 mb-6 grid max-w-[582px] place-items-center text-center lg:mb-8">
            {/* {latestPost && (
              <Link
                href={`/blog/${latestPost.slug}`}
                className="mb-4 inline-flex h-8 select-none items-center rounded-[56px] border border-white-10 bg-white-5 pl-2 pr-[6px]"
              >
                <p className="line-clamp-1 text-left text-15 font-medium text-white-100">
                  {latestPost.title}
                </p>
                <ChevronRightIcon className="ml-[2px] text-white-40" />
              </Link>
            )} */}

            <h1 className="mb-4 text-48 font-bold text-white-100 lg:mb-6 lg:text-88">
              Make the
              <br />
              jump to web3
            </h1>

            <p className="text-27 text-white-100">
              Use the open-source, decentralised wallet and messenger.
            </p>
          </div>

          <div className="relative z-20 inline-flex w-[237px] flex-col items-center gap-6 text-center md:w-full">
            <div
              data-theme="dark"
              className="flex w-fit flex-col items-stretch gap-2 rounded-16 border border-dashed border-neutral-80 p-2"
            >
              <DownloadDesktopButton variant="primary" show="all" />
            </div>
          </div>
          <div
            data-theme="dark"
            className="mt-6 flex max-w-[572px] flex-col items-start gap-4 rounded-20 border border-solid border-white-10 bg-white-5 px-5 py-3 text-left lg:flex-row lg:items-center lg:gap-10"
          >
            <div className="flex flex-col text-left">
              <h3 className="text-19 font-600 text-white-100">
                Try Status Portfolio Wallet (Beta)
              </h3>
              <p className="text-15 font-400 text-white-100">
                Easily view and manage your crypto portfolio in real time
                &mdash; Beta crypto wallet and Web3 portfolio tracker in one.
              </p>
            </div>
            <div className="flex items-center">
              <DownloadExtensionButton source="homepage-hero" />
            </div>
          </div>
          <Image
            id="Non Beta Release/Illustrations/Hero_Non_Beta_Release_Mobile_Long:4662:2579"
            alt=""
            aria-hidden
            width={735}
            height={406}
            className="absolute bottom-[-200px] left-[-70px] block max-w-[735px] -translate-y-40 md:left-1/2 md:-translate-x-1/2 xl:hidden"
            priority
          />
        </div>
      </div>

      <Body>
        <div className="container relative mx-auto pb-20 lg:pb-40">
          <h2 className="pb-12 pt-40 text-40 font-bold lg:pb-20 lg:text-64">
            Built different
          </h2>
          <div className="-ml-5">
            <FeatureList list={FEATURE_LIST} />
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
                  Send, swap
                  <br />
                  and bridge
                  <br />
                  crypto
                </>
              }
              description="All the features you have come to expect from your favorite crypto wallet."
              secondary={
                <div className="flex flex-col">
                  <div className="p-4">
                    <p className="text-19 font-semibold">
                      Ways to buy crypto with a credit card or Apple Pay!
                    </p>
                    <div className="flex pt-1">
                      <p className="text-19 font-regular text-neutral-100">
                        You can buy crypto via our on-ramp partners!
                      </p>
                    </div>
                  </div>
                  <Image
                    id="Non Beta Release/Icons/Payment_Icons:648:96"
                    alt=""
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
                    Chat privately
                    <br />
                    with friends
                  </>
                }
                description="Protect your right to free speech with decentralised messaging, metadata privacy and end-to-end encryption."
                secondary={
                  <div className="flex flex-col">
                    <div className="p-4">
                      <p className="text-19 font-semibold">
                        Communicate pseudonymously
                      </p>
                      <div className="flex pt-1">
                        <p className="text-19 font-regular text-neutral-100">
                          No identifying information like phone number, email,
                          bank card or other social media required to use
                          Status.
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
              Keep private who your friends are
            </h2>
            <p className="text-19 text-white-100">
              With our metadata privacy, no one can see who you're talking to.
            </p>
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
                  Join
                  <br />
                  token-gated
                  <br />
                  communities
                </>
              }
              description="Imagine a community group chat platform designed to work with crypto from the ground up."
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
                  Status Portfolio
                  <br />
                  Wallet (Beta)
                </h3>
                <p className="mb-20 max-w-[462px] text-19 font-regular xl:mb-44 xl:text-27">
                  Need an easy way to view and manage your crypto portfolio in
                  real time? Try Status Portfolio Wallet (Beta) now - a crypto
                  wallet and portfolio tracker in one.
                </p>

                <div className="flex flex-col items-start rounded-20 bg-white-20">
                  <DownloadExtensionButton
                    source="homepage-section"
                    variant="primary"
                    size="40"
                  >
                    Download for Chrome
                  </DownloadExtensionButton>
                </div>
              </div>
              <Image
                className="max-xl:mb-[-20%] xl:absolute xl:left-[42%] xl:top-[-44%]"
                width={1063}
                height={1195}
                id="Homepage/Screens/Extension Section/Extension_01:2127:2390"
                alt=""
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
                    Use Status
                  </h2>
                  <h2 className="relative inline-block whitespace-nowrap text-40 font-bold lg:text-64">
                    with Keycard
                    <span className="inline-block w-3 pt-1 align-top lg:w-4 lg:pt-[9px]">
                      <CopyrightSymbol />
                    </span>
                  </h2>
                </div>

                <Text size={19}>A secure contactless hardware wallet.</Text>
              </div>
              <Button variant="outline" href="/keycard">
                Learn More
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
              <h3 className="text-27 font-semibold">Stay up to date</h3>
              <Button
                variant="outline"
                href={ROUTES.Collaborate[2].href}
                size="32"
              >
                View Blog
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
              {PREFOOTER_LIST.map(({ title, description, link }) => (
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
                alt=""
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

const FEATURE_LIST: FeatureListProps['list'] = [
  {
    title: 'Open source',
    description:
      'Status is a community project. Anyone can build, contribute to and fork its source code.',
    icon: 'Non Beta Release/Icons/10:144:144',
  },
  {
    title: 'Decentralised',
    description:
      'Communities are exclusively powered by their members running the Status desktop app.',
    icon: 'Non Beta Release/Icons/11:144:144',
  },
  {
    title: 'Secure',
    description:
      'Self-custodial keys safeguard your wallets and messages via elliptic curve cryptography.',
    icon: 'Non Beta Release/Icons/12:145:144',
  },
  {
    title: 'Community driven',
    description:
      'SNT holders can influence future developments and governance decisions.',
    icon: 'Non Beta Release/Icons/13:145:144',
  },
  {
    title: 'Permissionless',
    description:
      'Nobody can stop you chatting with your friends because nobody controls Status’ p2p network.',
    icon: 'Non Beta Release/Icons/14:144:144',
  },
  {
    title: 'Free and ad-free',
    description: 'No ads. No paid tier. No imposed limits. It’s just free.',
    icon: 'Non Beta Release/Icons/15:145:144',
  },
]

const PREFOOTER_LIST = [
  {
    title: 'Decentralising the future',
    description:
      'Building apps to uphold human rights, free speech and privacy.',
    link: {
      label: 'Our manifesto',
      href: ROUTES.Organization.find(link => link.name === 'Manifesto')!.href,
    },
  },
  {
    title: 'A token by and for Status',
    description:
      'Participate in Status’ governance and help guide development with SNT.',
    link: {
      label: 'About SNT',
      href: ROUTES.SNT.find(link => link.name === 'Token')!.href,
    },
  },
  {
    title: 'Building our own L2',
    description: 'A thin, fast and secure execution layer for communities.',
    link: {
      label: 'About Status Network',
      href: ROUTES.Ecosystem.find(link => link.name === 'Status Network')!.href,
    },
  },
]
