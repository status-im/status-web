// import communityCardImage01 from '@assets/communities/community-card-01.png'
// import communityCardImage02 from '@assets/communities/community-card-02.png'
// import communityCardImage03 from '@assets/communities/community-card-03.png'
// import communityCardImage04 from '@assets/communities/community-card-04.png'
import featureImage1 from '@assets/communities/feature-01.png'
import featureImage2 from '@assets/communities/feature-02.png'
import featureImage3 from '@assets/communities/feature-03.png'
import featureImage4 from '@assets/communities/feature-04.png'
import featureImage5 from '@assets/communities/feature-05.png'
import heroImage1 from '@assets/communities/hero-01.png'
import heroImage2 from '@assets/communities/hero-02.png'
// TODO FIX BOX SHADOW
import heroImage3 from '@assets/communities/hero-03.png'
import heroImage4 from '@assets/communities/hero-04.png'
import illustrationMain from '@assets/communities/illustration-main.png'
// import image5 from '@assets/communities/grid-5.png'
import sectionImage1 from '@assets/communities/section-01.png'
import sectionImage2 from '@assets/communities/section-02.png'
import { Button, Text } from '@status-im/components'
import Image from 'next/image'

import { Section } from '@/components/cards'
import { Hero } from '@/components/hero'
import { ImageGrid } from '@/components/image-grid'
import { VideoSection } from '@/components/video-section'
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
        images={[heroImage1, heroImage2, heroImage3, heroImage4]}
        maxWidth={702}
      />

      <VideoSection
        title="Fully Decentralized Communities"
        description="Status’ Waku p2p messaging network is powered by people running Status Desktop - true decentralisation."
        image={{ ...illustrationMain, width: 765, height: 725 }}
      />

      <div className="pb-12 lg:pb-20">
        <Section
          icon="skull"
          title="Token gated channels & communities"
          description="Access exclusive community spaces and content. Controlled access plus moderation for high signal to noise."
          secondaryTitle="Become eligible for airdrops"
          secondaryDescription="Every Status Community can create their own tokens and optionally airdrop tokens to their members.  Of course of doing an airdrop or not is enterally the individual choice of each community"
          image={sectionImage1}
          imageAlt="wallet-5"
          color="turquoise"
        />

        <Section
          icon="skull"
          title="DeFi, DAO and NFT communities"
          description="Status Communities is built around tokenised functionality, perfect for blockchain enthusiast communities."
          secondaryTitle="Every community sets its own rules"
          secondaryDescription="Anybody can create a community, which is it’s own self-sovereign space.  This means that what each community does is enterally up to them.  Join the ones you like, leave the ones you don’t."
          reverse
          image={sectionImage2}
          imageAlt="wallet-5"
          color="turquoise"
        />
      </div>

      <div className="mx-auto max-w-[1200px] pb-60 pt-40">
        <div className="grid gap-4 pb-40">
          <h2 className="text-64">Your next community</h2>
          <Text size={27}>
            Explore the metaverse of communities and find your kindred spirits
            in the Status Community Directory.
          </Text>
          <div className="flex min-w-[1200px] flex-row gap-10 overflow-x-auto">
            <Image src={heroImage4} alt="TODO" />
            <Image src={heroImage4} alt="TODO" />
            <Image src={heroImage4} alt="TODO" />
            <Image src={heroImage4} alt="TODO" />
          </div>
        </div>
      </div>

      <div className="rounded-[40px] bg-customisation-turquoise/5 py-40">
        <div className="mx-auto max-w-[702px] gap-4 text-center">
          <h2 className="pb-4 text-64">A wonderful chat experience</h2>
          <Text size={27}>
            Give your community a unique look that reflects it’s passions and
            values. Or just look cool ✨
          </Text>
        </div>
        <div className="flex justify-center pb-10 pt-8">
          <Button variant="outline">See messenger features</Button>
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
