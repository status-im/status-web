import screenshot from '@assets/create-community/screenshot-01.png'
// import featureImage1 from '@assets/messenger/feature-01.png'
// import featureImage2 from '@assets/messenger/feature-02.png'
import featureImage3 from '@assets/messenger/feature-03.png'
import featureImage4 from '@assets/messenger/feature-04.png'
import featureImage5 from '@assets/messenger/feature-05.png'
import featureImage6 from '@assets/messenger/feature-06.png'
import featureImage7 from '@assets/messenger/feature-07.png'
import featureImage8 from '@assets/messenger/feature-08.png'
import featureImage9 from '@assets/messenger/feature-09.png'
import heroImage1 from '@assets/messenger/hero-01.png'
import heroImage2 from '@assets/messenger/hero-02.png'
import heroImage3 from '@assets/messenger/hero-03.png'
import heroImage4 from '@assets/messenger/hero-04.png'
import sectionImage1 from '@assets/messenger/section-01.png'
import sectionImage2 from '@assets/messenger/section-02.png'
import { Text } from '@status-im/components'
import { cx } from 'class-variance-authority'
import Image from 'next/image'

import { Section } from '@/components/cards'
import { Hero } from '@/components/hero'
import { SectionDesktopScreenshot } from '@/components/section-desktop-screenshot'
import { SectionLarge } from '@/components/section-large'
import { VideoSection } from '@/components/video-section'
import { AppLayout, Content } from '@/layouts/app-layout'

import type { Page } from 'next'

const MessengerPage: Page = () => {
  return (
    <>
      <Content>
        <Hero
          type="Messenger"
          title="Chat privately with friends"
          description="Protect your right to free speech. 1:1 and group chats with e2e encryption, perfect forward secrecy and metadata privacy."
          color="purple"
          images={[heroImage1, heroImage2, heroImage3, heroImage4]}
          maxWidth={581}
        />
        <div className="lg:pb-20">
          <VideoSection
            title="Fully Decentralized Messaging"
            description="Status’ Waku p2p messaging network is powered by people running Status Desktop - true decentralisation."
          />

          <Section
            color="purple"
            icon="skull"
            title="Private 1:1 messaging"
            description="E2E encrypted with perfect forward secrecy and metadata privacy."
            image={sectionImage1}
            imageAlt="wallet-2"
            secondaryTitle="Communicate pseudonymously"
            secondaryDescription="No identifying information required to use Status. We don’t force you to divulge for your phone number, email, bank card, google or facebook account (or anything else)."
          />
          <Section
            color="purple"
            icon="pizza"
            title="Unstoppable group chats"
            description="Chat with friends safely, knowing the conversation doesn’t leave the group"
            image={sectionImage2}
            imageAlt="wallet-5"
            secondaryTitle="With up to 20 people in each group chat"
            secondaryDescription="Some other platforms like Discord only let you create group chats with a maximum of 10 people. Status lets you create 20 person chats today and potentially even larger group chats tomorrow!"
            reverse
          />

          {/* <ComparisionSection /> */}

          {/* <div className="border-neutral-10 bg-white-100 relative rounded-[48px] border-t py-[160px] mix-blend-normal shadow-[0_-2px_20px_rgba(9,16,28,0.04)]">
        <Section
          title="New address format"
          description="A way for wallets to automatically signal which chains they can receive funds on. So you don’t have to."
          image="/images/wallet/7.png"
          imageAlt="wallet-7"


          secondaryDescription="Status is working with other wallets to ensure EIP-3770 with multiple chain shortName prefixes becomes the new ethereum address standard."
          secondaryTitle="On the path to adoption"
          reverse
        />
        <div className="relative pt-[160px]">
          <Section
            title="Total balance graphs"
            description="Who doesn’t want to see how their ‘crypto portfolio number’ has gone up or down over time?"
            image="/images/wallet/8.png"
            imageAlt="wallet-8"


            secondaryDescription="Everything is taken into account: fluctuations in fiat exchange rates, daily valuation updates of every crypto asset you hodl, and how your balance changes when tokens are sent/received"
            secondaryTitle="Graphs that do maths"
          />
        </div>
      </div> */}
          {/* <HandsSection /> */}
        </div>
      </Content>

      <div className="m-auto max-w-[700px] px-16 pb-[352px] pt-[524px] text-center">
        <h2 className="pb-3 text-64 text-white-100">
          Keep who your friends are private
        </h2>
        <Text size={19} color="$white-100">
          End to end encryption is important, but it doesn’t stop an
          eavesdropper knowing who is talking to who. Status’ metadata privacy
          fixes this - it means that even who you message with can’t be
          surveilled.
        </Text>
      </div>

      <Content>
        <SectionLarge
          title="A wonderful chat experience"
          description="No need to choose between a user experience you love, and being open source, decentralised and private. ✨"
        >
          <div className="mx-auto grid max-h-[1220px] grid-flow-col grid-rows-6 gap-5">
            <FeatureItem
              label="Photos"
              imageSrc={featureImage3}
              imageWidth={380}
              span="row-span-4"
            />
            <FeatureItem
              label="GIFs & Stickers"
              imageSrc={featureImage4}
              imageWidth={380}
              span="row-span-2"
            />

            <FeatureItem
              label="Code snippets"
              imageSrc={featureImage5}
              imageWidth={334}
              span="row-span-2"
            />
            <FeatureItem
              label="Audio messages"
              imageSrc={featureImage6}
              imageWidth={334}
              span="row-span-2"
            />
            <FeatureItem
              label="Text formatting"
              imageSrc={featureImage7}
              imageWidth={334}
              span="row-span-2"
            />

            <FeatureItem
              label="Links unrolled"
              imageSrc={featureImage8}
              imageWidth={380}
              span="row-span-3"
              reverse
            />
            <FeatureItem
              label="Write long messages"
              imageSrc={featureImage9}
              imageWidth={334}
              span="row-span-3"
              reverse
            />
          </div>
        </SectionLarge>
        <div className="py-40"></div>

        <div>
          <h2 className="text-center text-64">
            Your assets.
            <br />
            Your identity.
          </h2>
          <Text size={27}>
            Showcase some or all of your tokens, memberships and accounts with
            friends, the world, or keep private.
          </Text>

          <div>
            <Text size={13} color="$neutral-40" weight="medium">
              Preview examples
            </Text>

            <div className="flex gap-1">
              {['blue', 'pink', 'orange', 'green'].map(color => (
                <div
                  key={color}
                  style={{ ['--bg-color' as string]: color }}
                  className={`h-[24px] w-[24px] rounded-full bg-[var(--bg-color)]`}
                />
              ))}
            </div>
          </div>
        </div>
        <SectionDesktopScreenshot
          title="Share your profile"
          description="Using web URLs that can be posted on Web2 social media. User doesn’t have Status? Open in browser."
          // fix screenshot
          image={screenshot}
          icon="pizza"
        />
      </Content>
    </>
  )
}

const FeatureItem = ({
  label,
  imageSrc,
  imageWidth,
  imageAlt,
  span,
  reverse,
}: any) => {
  return (
    <div
      className={cx([
        'flex flex-col items-center rounded-[36px] border border-neutral-80/10 text-center',
        span,
        reverse && 'flex-col-reverse',
      ])}
    >
      <Image src={imageSrc} width={imageWidth} quality={80} alt={imageAlt} />
      <div className="py-4">
        <Text size={27} weight="semibold">
          {label}
        </Text>
      </div>
    </div>
  )
}

MessengerPage.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>
}

export default MessengerPage
