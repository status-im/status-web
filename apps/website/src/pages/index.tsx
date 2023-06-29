import communitiesImage1 from '@assets/homepage/communities-01.png'
// TODO: import communitiesImage2 from '@assets/homepage/communities-02.png'
import communitiesImage3 from '@assets/homepage/communities-03.png'
import communitiesImage4 from '@assets/homepage/communities-04.png'
import illustrationDark1 from '@assets/homepage/illustration-dark-01.png'
import illustrationDark2 from '@assets/homepage/illustration-dark-02.png'
import keycardImage from '@assets/homepage/illustration-keycard.png'
// import TODO messengerImage1 from '@assets/homepage/messenger-01.png'
import messengerImage2 from '@assets/homepage/messenger-02.png'
import messengerImage3 from '@assets/homepage/messenger-03.png'
import messengerImage4 from '@assets/homepage/messenger-04.png'
// TODO: import sectionImage1 from '@assets/homepage/section-01.png'
import walletImage1 from '@assets/homepage/wallet-01.png'
import walletImage2 from '@assets/homepage/wallet-02.png'
import walletImage3 from '@assets/homepage/wallet-03.png'
import walletImage4 from '@assets/homepage/wallet-04.png'
import { Button, Tag, Text } from '@status-im/components'
import { ConfettiIcon } from '@status-im/icons'
import { cx } from 'class-variance-authority'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { ParalaxCircle } from '@/components/parallax-circle'
import { ROUTES } from '@/config/routes'
import { stickers } from '@/config/stickers'
import { AppLayout, Content } from '@/layouts/app-layout'

import type { Page } from 'next'
import type { StaticImageData } from 'next/image'

const HomePage: Page = () => {
  const router = useRouter()

  return (
    <>
      <Content>
        <div className="relative overflow-hidden p-40">
          <div className="grid gap-8">
            <div className="grid max-w-[582px] gap-6">
              <h1 className="text-88">
                Make the
                <br />
                jump to web3
              </h1>

              <Text size={19}>
                An open source, decentralized communication super app
              </Text>
            </div>

            <div className="flex max-w-[460px] items-center gap-5 rounded-l-2xl rounded-r-[20px] border border-dashed border-neutral-80/20 p-2">
              <Text size={13}>
                Betas for Mac, Windows, Linux
                <br />
                Alphas for iOS & Android
              </Text>
              <Button size={40} icon={<ConfettiIcon size={20} />}>
                Sign up for early access
              </Button>
            </div>
          </div>

          <ParalaxCircle
            color="bg-customisation-blue-50"
            bottom={-194}
            left={-106}
          />
        </div>

        {/* COMMUNITIES */}
        <FeatureSection
          type="Communities"
          title="Discover your community"
          description="Find your tribe in the metaverse of truly free Status communities"
          images={[
            {
              src: communitiesImage1,
              alt: '',
              label: 'Explore the universe of self-sovereign communities',
              align: 'bottom',
              width: 380,
            },
            // {src:communitiesImage2,alt:"", label:""},
            {
              src: communitiesImage3,
              alt: '',
              label: 'Decentralized and permissionless',
              align: 'top',
              half: true,
              width: 334,
            },
            {
              src: communitiesImage3,
              alt: '',
              label:
                'Access token gated channels. Become eligible for airdrops.',
              align: 'top',
              half: true,
              width: 334,
            },
            { src: communitiesImage4, alt: '', label: '', width: 334 },
          ]}
        >
          <ParalaxCircle
            color="bg-customisation-turquoise-50"
            right={90}
            top={-110}
          />
        </FeatureSection>
      </Content>

      {/* DARK SECTION */}
      <div className="relative z-0 flex h-[388px] flex-col items-center justify-center bg-neutral-100 py-20">
        {/* <Tag size={32} label="Create community" color="$turquoise-50-opa-20" /> */}

        <Image
          src={illustrationDark1}
          alt=""
          width={556}
          height={436}
          className="absolute left-0"
        />
        <Image
          src={illustrationDark2}
          alt=""
          width={484}
          height={436}
          className="absolute right-0"
        />
        <div className="mb-8 text-center">
          <h2 className="text-40 text-white-100 lg:text-64">
            Take back control!
          </h2>
          <Text size={19} color="$white-100">
            Don’t give Discord or Telegram power over your community.
          </Text>
        </div>
        <Button variant="outline">Set your community free</Button>
      </div>

      <Content>
        {/* MESSENGER */}
        <FeatureSection
          type="Messenger"
          title="Chat privately with friends"
          description="Protect your right to free speech with e2e encryption and metadata privacy."
          images={[
            // { src: messengerImage1, alt: '', label: '' },
            {
              src: messengerImage2,
              alt: '',
              label: 'Create and join unstopable group chats',
              width: 334,
              align: 'bottom',
              half: true,
            },
            {
              src: messengerImage2,
              alt: '',
              label:
                'It’s the internet. Verify your contacts. Tools to manage trust.',
              width: 334,
              align: 'top',
              half: true,
            },
            {
              src: messengerImage3,
              alt: '',
              align: 'top',
              label: 'Send crypto to your friends directly from the chat',
              width: 380,
            },
            { src: messengerImage4, alt: '', label: '', width: 334 },
          ]}
        >
          <Image
            {...stickers.smudgeCat}
            alt=""
            className="absolute bottom-[512px] left-[10px]"
          />
          <Image
            {...stickers.pizza}
            alt=""
            className="absolute bottom-[112px] left-[457px]"
          />
          <Image
            {...stickers.grumpyCat}
            alt=""
            className="absolute right-[351px] top-[485px]"
          />
          <ParalaxCircle
            color="bg-customisation-purple-50"
            bottom={-32}
            left={0}
          />
          <ParalaxCircle
            color="bg-customisation-purple-50"
            right={140}
            top={-338}
          />
        </FeatureSection>

        {/* WALLET */}
        <FeatureSection
          type="Wallet"
          title="The future is multi-chain"
          description="L2s made simple - send and manage your crypto easily and safely across multiple networks."
          images={[
            { src: walletImage1, alt: '', width: 334 },
            {
              src: walletImage2,
              alt: '',
              label:
                'Fully self-custodial. Nobody can stop you using your tokens.',
              align: 'bottom',
              width: 316,
              half: true,
            },
            {
              src: walletImage3,
              alt: '',
              label: 'See how your total balances change over time, in fiat.',
              align: 'bottom',
              width: 334,
              half: true,
            },
            {
              src: walletImage4,
              alt: '',
              label:
                'Send with automatic bridging. No more multi-chain hassle.',
              align: 'bottom',
              width: 380,
            },
          ]}
        >
          <ParalaxCircle
            color="bg-customisation-yellow-50"
            top={-338}
            right={338}
          />
        </FeatureSection>

        {/* DAPP BROWSER */}
        <FeatureSection
          type="Browser"
          title="Explore dApps"
          description="Interact trustlessly with Web3 dApps, DAOs, NFTs, DeFi and much more"
          images={[
            { src: walletImage1, alt: '', width: 334 },
            // {src:walletImage2, alt: '', label:""},
            {
              src: walletImage3,
              alt: '',
              label:
                'Fully self-custodial. Nobody can stop you using your tokens.',
              align: 'bottom',
              width: 334,
              half: true,
            },
            {
              src: walletImage3,
              alt: '',
              label: 'See how your total balances change over time, in fiat.',
              align: 'bottom',
              width: 334,
              half: true,
            },
            {
              src: walletImage4,
              alt: '',
              label:
                'Send with automatic bridging. No more multi-chain hassle.',
              align: 'bottom',
              width: 380,
            },
          ]}
        >
          <ParalaxCircle
            color="bg-customisation-magenta-50"
            right={750}
            top={-338}
          />
          <ParalaxCircle
            color="bg-customisation-magenta-50"
            top={-338}
            right={-338}
          />
        </FeatureSection>

        <div className="relative grid grid-cols-2 items-center gap-[140px] overflow-hidden">
          <Image
            src={keycardImage}
            alt="Hand holding a green keycard"
            width={742}
            height={720}
          />
          <div className="flex max-w-[462px] flex-col items-start gap-8">
            <div className="flex flex-col gap-5">
              <h2 className="text-64">Status is better with Keycard</h2>
              <Text size={19}>A secure contactless hardware wallet</Text>
            </div>
            <Button variant="outline">Learn More</Button>
          </div>

          <ParalaxCircle
            color="bg-customisation-army-50"
            left={501}
            top={300}
          />
        </div>

        <div className="relative border-t border-dashed border-neutral-30">
          <Image
            src={stickers.doge.src}
            alt={stickers.doge.alt}
            width={110}
            height={110}
            className="absolute right-10 top-0 -translate-y-1/2"
          />
          <Image
            src={stickers.punk.src}
            alt={stickers.punk.alt}
            width={110}
            height={110}
            className="absolute bottom-10 left-5"
          />

          <div className="container flex justify-center divide-x divide-dashed divide-neutral-30 lg:px-30">
            {PREFOOTER_LIST.map(({ title, description, link }) => (
              <div key={title} className="px-10 py-40">
                <div className="mb-6 gap-1">
                  <h3>
                    <Text size={27} weight="semibold">
                      {title}
                    </Text>
                  </h3>
                  <Text size={15}>{description}</Text>
                </div>
                <div className="flex">
                  <Button
                    variant="outline"
                    onPress={() => router.push(link.href)}
                  >
                    {link.label}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Content>
    </>
  )
}

const PREFOOTER_LIST = [
  {
    title: 'Decentralising the future',
    description:
      'Building apps to uphold human rights, protect free speech & defend privacy.',
    link: {
      label: 'Our Mission',
      href: ROUTES.About[0].href,
    },
  },
  {
    title: 'A token by and for Status',
    description:
      'Participate in Status’ governance and help guide development with SNT.',
    link: {
      label: 'About SNT',
      href: ROUTES.About.find(link => link.name === 'Mission')!.href,
    },
  },
  {
    title: 'Stay up to date',
    description:
      'Follow development progress as we build a truly decentralized super app.',
    link: {
      label: 'Read the blog',
      href: ROUTES.Collaborate.find(link => link.name === 'Blog')!.href,
    },
  },
]

type FeatureImage = {
  src: StaticImageData
  alt: string
  label?: string
  align?: 'top' | 'bottom'
  half?: boolean
  width: number
}

type SectionProps = {
  type: 'Communities' | 'Create Community' | 'Wallet' | 'Messenger' | 'Browser'
  title: string
  description: string
  images: [FeatureImage, FeatureImage, FeatureImage, FeatureImage]
  children?: React.ReactNode
}

const FeatureSection = (props: SectionProps) => {
  const { type, title, description, images, children } = props

  return (
    <div className="overflow-hidden">
      <section className="relative mx-auto grid max-w-[1500px] gap-20 px-10 py-40">
        {children}
        <div className="flex max-w-[500px] flex-col items-start justify-start gap-4">
          <Tag
            size={32}
            // icon={WalletIcon}
            // color={`$${color}-50`}
            label={type}
          />
          <h2 className="flex-1 whitespace-pre-line text-40 lg:text-64">
            {title}
          </h2>
          <Text size={27}>{description}</Text>

          <div className="flex">
            <Button variant="outline">Learn more</Button>
          </div>
        </div>

        {/* FEATURE GRID */}
        <div className="grid h-[820px] grid-flow-col grid-cols-3 grid-rows-2 gap-5">
          {images.map((image, index) => (
            <div
              key={index}
              className={cx(
                'grid rounded-[32px] border border-neutral-80/5',
                'content-center justify-center',
                {
                  'row-span-1': image.half === true,
                  'row-span-2': image.half !== true,
                  'content-start': image.align === 'top',
                  'content-end': image.align === 'bottom',
                  'justify-items-end': image.align === 'bottom',
                }
              )}
            >
              <div
                className={cx('flex flex-col items-center', {
                  'flex-col': image.align === 'bottom',
                  'flex-col-reverse': image.align === 'top',
                })}
              >
                {image.label && (
                  <div className="p-6 text-center">
                    <Text size={27} weight="semibold">
                      {image.label}
                    </Text>
                  </div>
                )}
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  className={cx(
                    'rounded-3xl border-4 border-customisation-turquoise/5',
                    {
                      'rounded-t-none border-t-0': image.align === 'top',
                      'rounded-b-none border-b-0': image.align === 'bottom',
                    }
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

HomePage.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>
}

export default HomePage
