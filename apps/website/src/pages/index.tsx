import { Button, Tag, Text } from '@status-im/components'
import { DownloadIcon, PlayIcon } from '@status-im/icons'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { LINKS } from '@/config/links'
import { stickers } from '@/config/stickers'
import { AppLayout, Content } from '@/layouts/app-layout'

// import heroImage1 from '@assets/homepage/hero-01.png'
// TODO: import heroImage2 from '@assets/homepage/hero-02.png'
// import heroImage3 from '@assets/homepage/hero-03.png'
// import heroImage4 from '@assets/homepage/hero-04.png'
// import messengerImage1 from '@assets/homepage/messenger-01.png'
// import messengerImage2 from '@assets/homepage/messenger-02.png'
// import messengerImage3 from '@assets/homepage/messenger-03.png'
// import messengerImage4 from '@assets/homepage/messenger-04.png'
// import walletImage1 from '@assets/homepage/wallet-01.png'
// TODO: import walletImage2 from '@assets/homepage/wallet-02-placeholder.png'
// import walletImage3 from '@assets/homepage/wallet-03.png'
// import walletImage4 from '@assets/homepage/wallet-04.png'
// import sectionImage1 from '@assets/homepage/section-01.png'
import type { Page } from 'next'

const HomePage: Page = () => {
  const router = useRouter()

  return (
    <>
      <Content>
        <div className="px-5 py-32 lg:px-40">
          <div className="mb-40 grid gap-8 px-5 ">
            <div className="grid gap-6">
              <h1 className="text-88">
                Make the
                <br />
                jump to web3
              </h1>

              <Text size={19}>
                An open source, decentralized communication super app
              </Text>
            </div>

            <div className="grid gap-4">
              <div className="flex flex-col gap-3 lg:flex-col">
                <Button size={40} icon={<DownloadIcon size={20} />}>
                  Sign up for early access
                </Button>
                <Button
                  size={40}
                  variant="outline"
                  icon={<PlayIcon size={20} />}
                >
                  Watch Video
                </Button>
              </div>
              <Text size={11} color="$neutral-50">
                Avaliable for Mac, Windows, Linux, iOS & Android
              </Text>
            </div>
          </div>

          {/* <FeatureSection
            title={`Discover your \n community`}
            description="Join self-sovereign decentralized communities and start chatting."
          /> */}
        </div>

        <FeatureSection
          type="Communities"
          title="Discover your community"
          description="Find your tribe in the metaverse of truly free Status communities"
        />
      </Content>

      {/* DARK SECTION */}
      <div className="flex flex-col items-center justify-center bg-neutral-100 py-20">
        {/* <Tag size={32} label="Create community" color="$turquoise-50-opa-20" /> */}
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
        <FeatureSection
          type="Messenger"
          title="Chat privately with friends"
          description="Protect your right to free speech with e2e encryption and metadata privacy."
        />
        <FeatureSection
          type="Wallet"
          title="The future is multi-chain"
          description="L2s made simple - send and manage your crypto easily and safely across multiple networks."
        />

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
          <div className="mx-auto flex justify-center divide-x divide-dashed divide-neutral-30">
            {PREFOOTER_LIST.map(({ title, description, link }) => (
              <div key={title} className="px-10 py-40">
                <div className="mb-6 w-full max-w-[330px] gap-1">
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
      href: LINKS.About[0].href,
    },
  },
  {
    title: 'A token by and for Status',
    description:
      'Participate in Status’ governance and help guide development with SNT.',
    link: {
      label: 'About SNT',
      href: LINKS.About.find(link => link.name === 'Mission')!.href,
    },
  },
  {
    title: 'Stay up to date',
    description:
      'Follow development progress as we build a truly decentralized super app.',
    link: {
      label: 'Read the blog',
      href: LINKS.Collaborate.find(link => link.name === 'Blog')!.href,
    },
  },
]

// type FeatureSectionProps = {
//   title: string
//   description: string
// }

// const FeatureSection = ({ title, description }: FeatureSectionProps) => {
//   return (
//     <section className="px-10">
//       <div className="mb-24 flex flex-col justify-between lg:flex-row">
//         <h2 className="flex-1 whitespace-pre-line text-6xl font-bold">
//           {title}
//         </h2>

//         <div className="flex flex-col gap-4">
//           <Text size={27}>{description}</Text>
//           <Text size={27} weight="medium">
//             Learn More
//           </Text>
//         </div>
//       </div>

//       <FeatureGrid />
//     </section>
//   )
// }

type SectionProps = {
  type: 'Communities' | 'Create Community' | 'Wallet' | 'Messenger'
  title: string
  description: string
}

const FeatureSection = (props: SectionProps) => {
  const { type, title, description } = props
  return (
    <section className="grid gap-20 px-10 py-40">
      <div className="flex max-w-[462px] flex-col items-start justify-start gap-4">
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

      <FeatureGrid />
    </section>
  )
}

const FeatureGrid = () => {
  return (
    <div className="grid h-[800px] grid-cols-3 grid-rows-2 gap-5">
      <div className="row-span-2 rounded-[32px] border border-neutral-80/5">
        <Text size={27} weight="semibold">
          Title
        </Text>
      </div>
      <div className="rounded-[32px] border border-neutral-80/5">
        <Text size={27} weight="semibold">
          Title
        </Text>
      </div>
      <div className="row-span-2 rounded-[32px] border border-neutral-80/5">
        <Text size={27} weight="semibold">
          Title
        </Text>
      </div>
      <div className="rounded-[32px] border border-neutral-80/5">
        <Text size={27} weight="semibold">
          Title
        </Text>
      </div>
    </div>
  )
}

HomePage.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>
}

export default HomePage
