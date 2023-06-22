import featureImage1 from '@assets/communities/feature-1.png'
import featureImage2 from '@assets/communities/feature-2.png'
import featureImage3 from '@assets/communities/feature-3.png'
import featureImage4 from '@assets/communities/feature-4.png'
import featureImage5 from '@assets/communities/feature-5.png'
import image1 from '@assets/communities/grid-1.png'
import image2 from '@assets/communities/grid-2.png'
import image3 from '@assets/communities/grid-3.png'
import image4 from '@assets/communities/grid-4.png'
// import image5 from '@assets/communities/grid-5.png'
import { Text } from '@status-im/components'
import Image from 'next/image'

import { Hero } from '@/components/hero'
import { ImageGrid } from '@/components/image-grid'
import { TwoColsSection, VideoSection } from '@/components/messenger'
import { AppLayout, Content } from '@/layouts/app-layout'

import type { Page } from 'next'

const CommunitiesPage: Page = () => {
  return (
    <Content>
      <Hero
        type="Communities"
        title="Discover your community"
        description="Find your tribe in the metaverse of truly free Status communities."
        color="turquoise"
        images={[image1, image2, image3, image4]}
      />

      {/* title="Fully Decentralized Communities" */}
      {/* description="Status’ Waku p2p messaging network is powered by people running Status Desktop - true decentralisation." */}
      <VideoSection />

      <TwoColsSection
        title="Token gated channels & communities"
        description="Access exclusive community spaces and content. Controlled access plus moderation for high signal to noise."
        image="/assets/communities/6.png"
        imageAlt="wallet-5"
        imageSecondary="/images/wallet/pizza.png"
        imageSecondaryAlt="pizza"
        secondaryTitle="Become eligible for airdrops"
        secondaryDescription="Every Status Community can create their own tokens and optionally airdrop tokens to their members.  Of course of doing an airdrop or not is enterally the individual choice of each community"
      />

      <TwoColsSection
        title="DeFi, DAO and NFT communities"
        description="Status Communities is built around tokenised functionality, perfect for blockchain enthusiast communities."
        image="/assets/communities/5.png"
        imageAlt="wallet-5"
        imageSecondary="/images/wallet/pizza.png"
        imageSecondaryAlt="pizza"
        secondaryTitle="Every community sets its own rules"
        secondaryDescription="Anybody can create a community, which is it’s own self-sovereign space.  This means that what each community does is enterally up to them.  Join the ones you like, leave the ones you don’t."
        direction="rtl"
      />

      <div className="pb-60 pt-40">
        <div className="grid max-w-[475px] gap-4 pb-40">
          <h2 className="text-[64px] font-bold leading-[68px]">
            Your next community
          </h2>
          <Text size={27}>
            Explore the metaverse of communities and find your kindred spirits
            in the Status Community Directory.
          </Text>
        </div>
      </div>

      <div className="py-40">
        <div className="mx-auto max-w-[702px] gap-4 text-center">
          <h2 className="text-[64px] font-bold leading-[68px]">
            A wonderful chat experience
          </h2>
          <Text size={27}>
            Give your community a unique look that reflects it’s passions and
            values. Or just look cool ✨
          </Text>
        </div>

        {/* TODO: add row spans */}
        <ImageGrid>
          <div className="row-span-2">
            <Image src={featureImage1} alt="TODO" />
          </div>
          <div className="row-span-4">
            <Image src={featureImage2} alt="TODO" />
          </div>

          <div className="row-span-6">
            <Image src={featureImage3} alt="TODO" />
          </div>

          <div className="row-span-4">
            <Image src={featureImage4} alt="TODO" />
          </div>
          <div className="row-span-2">
            <Image src={featureImage5} alt="TODO" />
          </div>
        </ImageGrid>
      </div>
    </Content>
  )
}

CommunitiesPage.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>
}

export default CommunitiesPage
