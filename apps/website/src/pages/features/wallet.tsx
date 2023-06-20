import {
  ComparisionSection,
  HandsSection,
  HeroSection,
  ParalaxCircle,
  TwoColsSection,
  VideoSection,
} from '@/components/wallet'
import { AppLayout } from '@/layouts/app-layout'

import type { Page } from 'next'

const WalletPage: Page = () => {
  return (
    <>
      <div className="overflow-hidden pt-16 lg:pt-32">
        <HeroSection />
        <VideoSection />
        <div className="relative pt-[220px]">
          <ParalaxCircle initialRight={-100} initialTop={-100} />
          <TwoColsSection
            title="True multi-chain experience"
            description=" All networks, all the time. See all your assets and NFTs in one place, even if spread across multiple blockchains."
            image="/images/wallet/4.png"
            imageAlt="wallet-2"
            imageSecondary="/images/wallet/skull.png"
            imageSecondaryAlt="skull"
            secondaryDescription=" You can treat it like other wallets by selecting individual chains manually. But once you’ve tried the Status ‘all chains, always’ way of doing things, you won’t want to go back."
            secondaryTitle=" Can be used as ‘single chain at a time’ wallet"
          />
        </div>
        <div className="relative pt-[160px]">
          <TwoColsSection
            title="Simple token sending"
            description=" Select token, amount and press “Send”. Need to bridge between blockchains? Status does this automatically."
            image="/images/wallet/5.png"
            imageAlt="wallet-5"
            imageSecondary="/images/wallet/pizza.png"
            imageSecondaryAlt="pizza"
            secondaryDescription="Status automatically calculates the cheapest way of moving tokens from A to B, considering: gas prices, chains your tokens are on, chains the recipient uses, and bridge costs. All in real time."
            secondaryTitle="Cost efficient"
            direction="rtl"
          />
        </div>
        <div className="relative py-[160px]">
          <TwoColsSection
            title="Full control for power users"
            description="Select exact amounts to send from each blockchain, and precisely set the chains the recipient will receive funds on."
            image="/images/wallet/6.png"
            imageAlt="wallet-6"
            imageSecondary="/images/wallet/duck.png"
            imageSecondaryAlt="duck"
            secondaryDescription="Gas limit, max base fee, max priority fee, input data and nounce value for every transaction in each transaction bundle. If you really want to..."
            secondaryTitle="Pro user? You can edit:"
          />
          <ParalaxCircle initialRight={-200} initialTop={-300} />
        </div>

        <ComparisionSection />
        <div className="border-neutral-10 bg-white-100 relative rounded-[48px] border-t py-[160px] mix-blend-normal shadow-[0_-2px_20px_rgba(9,16,28,0.04)]">
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
        </div>
        <HandsSection />
      </div>
    </>
  )
}

WalletPage.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>
}

export default WalletPage
