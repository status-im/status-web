import { Button, Text } from '@status-im/components'
import { DownloadIcon, PlayIcon } from '@status-im/icons'

import { AppLayout } from '@/layouts/app-layout'

import type { Page } from 'next'

const HomePage: Page = () => {
  return (
    <>
      <div className="bg-white-100 mx-1 rounded-3xl py-32">
        <div className="mx-40 mb-40 grid gap-8">
          <div className="grid gap-6">
            <h1 className="text-7xl font-bold">
              Make the
              <br />
              jump to web3
            </h1>

            <Text size={19}>
              An open source, decentralized communication super app
            </Text>
          </div>

          <div className="grid gap-4">
            <div className="flex gap-3">
              <Button size={40} icon={<DownloadIcon size={20} />}>
                Get Status
              </Button>
              <Button size={40} variant="outline" icon={<PlayIcon size={20} />}>
                Watch Video
              </Button>
            </div>
            <Text size={11} color="$neutral-50">
              Avaliable for Mac, Windows, Linux, iOS & Android
            </Text>
          </div>
        </div>

        <FeatureSection
          title={`Discover your \n community`}
          description="Join self-sovereign decentralized communities and start chatting."
        />
      </div>

      <div className="text-center">
        <h2 className="text-white-100 text-4xl">
          Own a community? Time to take back control!
        </h2>
        <Text size={19} color="$white-100">
          {"Don't give Discord and Telegram power over your community."}
        </Text>
      </div>

      <div className="bg-white-100 mx-1 space-y-[200px] rounded-3xl py-32">
        <FeatureSection
          title={`Chat privately\nwith friends`}
          description="Protect your right to free speech with e2e encryption & metadata privacy."
        />
        <FeatureSection
          title={`Own your\ncrypto`}
          description="Own your keys to safely send and manage your assets and collectibles."
        />
        <FeatureSection
          title={`Explore the\nworld of web3`}
          description="Browse decentralized exchanges, marketplaces, and social networks"
        />

        <FeatureGrid />
      </div>
    </>
  )
}

type FeatureSectionProps = {
  title: string
  description: string
}

const FeatureSection = ({ title, description }: FeatureSectionProps) => {
  return (
    <section className="px-10">
      <div className="mb-24 flex justify-between">
        <h2 className="flex-1 whitespace-pre-line text-6xl font-bold">
          {title}
        </h2>

        <div className="flex flex-col gap-4">
          <Text size={27}>{description}</Text>
          <Text size={27} weight="medium">
            Learn More
          </Text>
        </div>
      </div>

      <FeatureGrid />
    </section>
  )
}

const FeatureGrid = () => {
  return (
    <div className="grid h-[800px] grid-cols-3 grid-rows-2 gap-5">
      <div className="border-neutral-80/5 row-span-2 rounded-[32px] border">
        <Text size={27} weight="semibold">
          Title
        </Text>
      </div>
      <div className="border-neutral-80/5 rounded-[32px] border">
        <Text size={27} weight="semibold">
          Title
        </Text>
      </div>
      <div className="border-neutral-80/5 row-span-2 rounded-[32px] border">
        <Text size={27} weight="semibold">
          Title
        </Text>
      </div>
      <div className="border-neutral-80/5 rounded-[32px] border">
        <Text size={27} weight="semibold">
          Title
        </Text>
      </div>
    </div>
  )
}

HomePage.getLayout = AppLayout

export default HomePage
