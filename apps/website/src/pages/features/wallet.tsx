import { Text } from '@felicio/components'
import imageSection1 from 'public/assets/wallet/4.png'
import imageSection2 from 'public/assets/wallet/5.png'
import imageSection3 from 'public/assets/wallet/6.png'
import imageSection4 from 'public/assets/wallet/7.png'
import imageSection5 from 'public/assets/wallet/8.png'
import cubeImage from 'public/assets/wallet/cube.png'
import duckImage from 'public/assets/wallet/duck.png'
import megaphone from 'public/assets/wallet/megaphone.png'
import pizzaImage from 'public/assets/wallet/pizza.png'
import skullImage from 'public/assets/wallet/skull.png'

import { Section } from '@/components/cards'
import {
  ComparisionSection,
  HandsSection,
  HeroSection,
  ParalaxCircle,
  VideoSection,
} from '@/components/wallet'
import { AppLayout } from '@/layouts/app-layout'

import type { Page } from 'next'

const WalletPage: Page = () => {
  return (
    <div className="overflow-hidden pt-16 lg:pt-32">
      <HeroSection />
      <VideoSection />
      <div className="relative pt-0 md:pt-[220px]">
        <ParalaxCircle initialRight={-100} initialTop={-100} />
        <Section
          color="yellow"
          title="True multi-chain experience"
          description=" All networks, all the time. See all your assets and NFTs in one place, even if spread across multiple blockchains."
          image={imageSection1}
          imageAlt="wallet-2"
          imageSecondary={skullImage}
          imageSecondaryAlt="skull"
          secondaryDescription=" You can treat it like other wallets by selecting individual chains manually. But once you’ve tried the Status ‘all chains, always’ way of doing things, you won’t want to go back."
          secondaryTitle=" Can be used as ‘single chain at a time’ wallet"
          information="This has some information so it will show the icon to open the dialog"
        />
      </div>
      <div className="relative pt-24 md:pt-[160px]">
        <Section
          color="yellow"
          title="Simple token sending"
          description=" Select token, amount and press “Send”. Need to bridge between blockchains? Status does this automatically."
          image={imageSection2}
          imageAlt="wallet-5"
          imageSecondary={pizzaImage}
          imageSecondaryAlt="pizza"
          secondaryDescription="Status automatically calculates the cheapest way of moving tokens from A to B, considering: gas prices, chains your tokens are on, chains the recipient uses, and bridge costs. All in real time."
          secondaryTitle="Cost efficient"
          direction="rtl"
          customNode={
            <div className="relative rounded-2xl border border-neutral-80/5 px-4 py-3">
              <Text size={15} color="$neutral-50">
                EIP-3770 format:
              </Text>
              <p className="text-[19px] leading-[28px] text-neutral-100">
                <span className="text-networks-ethereum">eth:</span>
                <span className="text-networks-optimism">opt:</span>
                <span className="text-networks-arbitrum">artb:</span>
                0xAbc123...xyz789
              </p>
            </div>
          }
        />
      </div>
      <div className="relative py-0 md:py-[160px]">
        <Section
          color="yellow"
          title="Full control for power users"
          description="Select exact amounts to send from each blockchain, and precisely set the chains the recipient will receive funds on."
          image={imageSection3}
          imageAlt="wallet-6"
          imageSecondary={duckImage}
          imageSecondaryAlt="duck"
          secondaryDescription="Gas limit, max base fee, max priority fee, input data and nounce value for every transaction in each transaction bundle. If you really want to..."
          secondaryTitle="Pro user? You can edit:"
        />
        <ParalaxCircle initialRight={-200} initialTop={-300} />
      </div>

      <ComparisionSection />
      <div className="relative rounded-[48px] border-t border-neutral-10 bg-white-100 py-0 mix-blend-normal shadow-[0_-2px_20px_rgba(9,16,28,0.04)] md:py-[160px]">
        <Section
          color="yellow"
          title="New address format"
          description="A way for wallets to automatically signal which chains they can receive funds on. So you don’t have to."
          image={imageSection4}
          imageAlt="wallet-7"
          imageSecondary={cubeImage}
          imageSecondaryAlt="cube"
          secondaryDescription="Status is working with other wallets to ensure EIP-3770 with multiple chain shortName prefixes becomes the new ethereum address standard."
          secondaryTitle="On the path to adoption"
          direction="rtl"
        />
        <div className="relative pt-0 md:pt-[160px]">
          <Section
            color="yellow"
            title="Total balance graphs"
            description="Who doesn’t want to see how their ‘crypto portfolio number’ has gone up or down over time?"
            image={imageSection5}
            imageAlt="wallet-8"
            imageSecondary={megaphone}
            imageSecondaryAlt="megaphone"
            secondaryDescription="Everything is taken into account: fluctuations in fiat exchange rates, daily valuation updates of every crypto asset you hodl, and how your balance changes when tokens are sent/received"
            secondaryTitle="Graphs that do maths"
          />
        </div>
      </div>
      <HandsSection />
    </div>
  )
}

WalletPage.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>
}

export default WalletPage
