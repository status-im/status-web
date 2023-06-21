import { Text } from '@status-im/components'
import { cx } from 'class-variance-authority'
import Image from 'next/image'

import {
  ComparisionSection,
  HandsSection,
  HeroSection,
  ParalaxCircle,
  TwoColsSection,
  VideoSection,
} from '@/components/messenger'
import audioMessagesSrc from '@/components/messenger/assets/audio-messages.png'
import codeSnippetsSrc from '@/components/messenger/assets/code-snippets.png'
import gifsAndStickersSrc from '@/components/messenger/assets/gifs-and-stickers.png'
import linksUnrolledSrc from '@/components/messenger/assets/links-unrolled.png'
import longMessagesSrc from '@/components/messenger/assets/long-messages.png'
import photosSrc from '@/components/messenger/assets/photos.png'
import textFormattingSrc from '@/components/messenger/assets/text-formatting.png'
import { AppLayout, Content } from '@/layouts/app-layout'

import type { Page } from 'next'

const MessengerPage: Page = () => {
  return (
    <>
      <Content>
        <div className="overflow-hidden pt-16 lg:pt-32">
          <HeroSection />
          <VideoSection />
          <div className="relative pt-[220px]">
            <ParalaxCircle initialRight={-100} initialTop={-100} />
            <TwoColsSection
              title="True multi-chain experience"
              description="All networks, all the time. See all your assets and NFTs in one place, even if spread across multiple blockchains."
              image="/images/wallet/4.png"
              imageAlt="wallet-2"
              imageSecondary="/images/wallet/skull.png"
              imageSecondaryAlt="skull"
              secondaryTitle="Communicate pseudonymously"
              secondaryDescription="No identifying information required to use Status. We don’t force you to divulge for your phone number, email, bank card, google or facebook account (or anything else)."
            />
          </div>
          <div className="relative pt-[160px]">
            <TwoColsSection
              title="Private 1:1 messaging"
              description="E2E encrypted with perfect forward secrecy and metadata privacy.  "
              image="/images/wallet/5.png"
              imageAlt="wallet-5"
              imageSecondary="/images/wallet/pizza.png"
              imageSecondaryAlt="pizza"
              secondaryDescription="Status automatically calculates the cheapest way of moving tokens from A to B, considering: gas prices, chains your tokens are on, chains the recipient uses, and bridge costs. All in real time."
              secondaryTitle="Cost efficient"
              direction="rtl"
            />
          </div>

          {/* <ComparisionSection /> */}

          {/* <div className="border-neutral-10 bg-white-100 relative rounded-[48px] border-t py-[160px] mix-blend-normal shadow-[0_-2px_20px_rgba(9,16,28,0.04)]">
        <TwoColsSection
          title="New address format"
          description="A way for wallets to automatically signal which chains they can receive funds on. So you don’t have to."
          image="/images/wallet/7.png"
          imageAlt="wallet-7"
          imageSecondary="/images/wallet/cube.png"
          imageSecondaryAlt="cube"
          secondaryDescription="Status is working with other wallets to ensure EIP-3770 with multiple chain shortName prefixes becomes the new ethereum address standard."
          secondaryTitle="On the path to adoption"
          direction="rtl"
        />
        <div className="relative pt-[160px]">
          <TwoColsSection
            title="Total balance graphs"
            description="Who doesn’t want to see how their ‘crypto portfolio number’ has gone up or down over time?"
            image="/images/wallet/8.png"
            imageAlt="wallet-8"
            imageSecondary="/images/wallet/megaphone.png"
            imageSecondaryAlt="megaphone"
            secondaryDescription="Everything is taken into account: fluctuations in fiat exchange rates, daily valuation updates of every crypto asset you hodl, and how your balance changes when tokens are sent/received"
            secondaryTitle="Graphs that do maths"
          />
        </div>
      </div> */}
          <HandsSection />
        </div>
      </Content>

      <div className="py-[200px]">
        <h2 className="text-white-100 font-bold">
          Keep who your friends are private
        </h2>
        <p className="text-white-100 font-bold">
          End to end encryption is important, but it doesn’t stop an
          eavesdropper knowing who is talking to who. Status’ metadata privacy
          fixes this - it means that even who you message with can’t be
          surveilled.
        </p>
      </div>

      <Content>
        <div className="py-40">
          <div className="mx-auto max-w-[702px] gap-4 text-center">
            <h2 className="text-[64px] font-bold leading-[68px]">
              A wonderful
              <br />
              chat experience
            </h2>
            <Text size={27}>
              No need to choose between a user experience you love, and being
              open source, decentralised and private. ✨
            </Text>
          </div>
          <div className="mx-auto grid max-h-[1220px] grid-flow-col grid-rows-6 gap-5">
            <FeatureItem
              label="Photos"
              imageSrc={photosSrc}
              imageWidth={380}
              span="row-span-4"
            />
            <FeatureItem
              label="GIFs & Stickers"
              imageSrc={gifsAndStickersSrc}
              imageWidth={380}
              span="row-span-2"
            />

            <FeatureItem
              label="Code snippets"
              imageSrc={codeSnippetsSrc}
              imageWidth={334}
              span="row-span-2"
            />
            <FeatureItem
              label="Audio messages"
              imageSrc={audioMessagesSrc}
              imageWidth={334}
              span="row-span-2"
            />
            <FeatureItem
              label="Text formatting"
              imageSrc={textFormattingSrc}
              imageWidth={334}
              span="row-span-2"
            />

            <FeatureItem
              label="Links unrolled"
              imageSrc={linksUnrolledSrc}
              imageWidth={380}
              span="row-span-3"
              reverse
            />
            <FeatureItem
              label="Write long messages"
              imageSrc={longMessagesSrc}
              imageWidth={334}
              span="row-span-3"
              reverse
            />
          </div>
        </div>

        <div>
          <h2 className="text-center text-[64px] font-bold leading-[68px]">
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
                  style={{
                    '--bg-color': color,
                  }}
                  className={`h-[24px] w-[24px] rounded-full bg-[var(--bg-color)]`}
                />
              ))}
            </div>
          </div>
        </div>
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
}) => {
  return (
    <div
      className={cx([
        'border-neutral-80/10 flex flex-col items-center rounded-[36px] border text-center',
        span,
        reverse && 'flex-col-reverse',
      ])}
    >
      <Image src={imageSrc} width={imageWidth} quality={80} />
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
