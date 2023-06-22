import featureImage1 from '@assets/create-community/feature-1.png'
import featureImage2 from '@assets/create-community/feature-2.png'
import featureImage3 from '@assets/create-community/feature-3.png'
import featureImage4 from '@assets/create-community/feature-4.png'
import featureImage5 from '@assets/create-community/feature-5.png'
import heroImage1 from '@assets/create-community/grid-1.png'
import heroImage2 from '@assets/create-community/grid-2.png'
import heroImage3 from '@assets/create-community/grid-3.png'
import heroImage4 from '@assets/create-community/grid-4.png'
import { Text } from '@status-im/components'
import Image from 'next/image'

import { Hero } from '@/components/hero'
import { ImageGrid } from '@/components/image-grid'
import { TwoColsSection } from '@/components/messenger'
import { SectionLarge } from '@/components/section-large'
import { AppLayout, Content } from '@/layouts/app-layout'

import dogeImage from '../../../public/images/illustrations/doge.png'
import duckImage from '../../../public/images/illustrations/duck.png'
import flowerImage from '../../../public/images/illustrations/flower.png'
import handImage from '../../../public/images/illustrations/hand.png'
import megaphoneImage from '../../../public/images/illustrations/megaphone.png'
import mushroomImage from '../../../public/images/illustrations/mushroom.png'

import type { Page } from 'next'

const featureList = [
  {
    title: 'Decentralized',
    description:
      'Communities are literally powered by their members running the Status Desktop app.',
    imageSrc: dogeImage,
  },
  {
    title: 'Permissionless',
    description:
      'Nobody can stop you creating a community, because nobody controls Status’ p2p network.',
    imageSrc: mushroomImage,
  },
  {
    title: 'Self-sovereign',
    description:
      'Each community can set it’s own rules, whatever they are.  And is responsible for it’s own actions. ',
    imageSrc: handImage,
  },
  {
    title: '100% Free to use',
    description:
      'No paid tier. No artificially imposed limits. No commission charged on community token sales.',
    imageSrc: duckImage,
  },
  {
    title: '100% Open source',
    description:
      'Status itself is a community project.  Anyone can build, contribute to and fork it’s source code.',
    imageSrc: flowerImage,
  },
  {
    title: '100% Freedom',
    description:
      'Status’s mission is to protect free speech, uphold human rights and defend privacy.',
    imageSrc: megaphoneImage,
  },
]

const CreateCommunityPage: Page = () => {
  return (
    <Content className="bg-neutral-80">
      <Hero
        type="Create Community"
        title="Your community can take back control"
        description="Make your community autonomous and self sovereign."
        images={[heroImage1, heroImage2, heroImage3, heroImage4]}
        color="turquoise"
      />

      {/* <HeroSection /> */}
      {/* Decentralized. Permissionless. Free. */}
      {/* By using Status, your community can regain control of it’s destiny and data. */}
      {/* <VideoSection /> */}

      <div className="grid grid-cols-3 gap-20 py-40">
        {featureList.map(feature => (
          <div key={feature.title} className="flex flex-col">
            <Image
              src={feature.imageSrc}
              alt={feature.title}
              width={48}
              height={48}
              className="mb-4"
            />
            <Text size={27} weight="semibold">
              {feature.title}
            </Text>
            <Text
              size={19}
              //  color="$white-80"
            >
              {feature.description}
            </Text>
          </div>
        ))}
      </div>

      <SectionLarge
        title="Crypto native"
        description="Imagine a community group chat platform designed to work with crypto from the ground up."
        description2="With token gating, minting, airdrop and retail tools, the possibilities for your community are limitless."
      >
        <TwoColsSection
          title="Token gating"
          description="Only let hodlers of specific tokens read or post to channels. Or require tokens to join your community."
          // TODO: explanation
          image="/assets/create-community/8.png"
          imageAlt="wallet-5"
          imageSecondary="/images/wallet/pizza.png"
          imageSecondaryAlt="pizza"
          secondaryTitle="Powerful permissions"
          secondaryDescription="Use ERC-20, NFT and ENS tokens plus AND and OR statements in rules. Set channels so anybody can read, but tokens are required to post. Assign admin permissions with remotely destructible soulbound tokens. And much, much more!"
          direction="rtl"
        />

        <div className="grid grid-flow-col gap-5">
          {[1, 2, 3].map(item => (
            <div key={item} className="rounded-[36px] backdrop-blur-lg">
              <div className="flex flex-col p-6">
                <Text size={27} weight="semibold">
                  Token minting
                </Text>
                <Text size={19}>
                  Mint NFT and ERC-20 tokens on any chain. Choose from finite or
                  unlimited supply. Create soulbound and remotely destructible
                  NFTs.
                  {/* TODO EXPLAINATION */}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </SectionLarge>

      <SectionLarge
        title="Your brand. Your community."
        description="Give your community a unique look that reflects it’s passions and values. Or just look cool ✨"
      >
        <ImageGrid>
          <ImageGrid.Item src={featureImage1} alt="feature-1" span={5} />

          <ImageGrid.Item src={featureImage2} alt="feature-2" span={2} />
          <ImageGrid.Item src={featureImage3} alt="feature-3" span={4} />

          <ImageGrid.Item src={featureImage4} alt="feature-4" span={3} />
          <ImageGrid.Item src={featureImage5} alt="feature-5" span={3} />
        </ImageGrid>
      </SectionLarge>

      {/* FULL PAGE SCREENSHOT */}

      <TwoColsSection
        title="Make your community discoverable"
        description="Propose your community for inclusion in the ‘community directory’ that lets Status users discover communities."
        // todo explanation
        image="/assets/create-community/8.png"
        imageAlt="wallet-2"
        imageSecondary="/images/wallet/skull.png"
        imageSecondaryAlt="skull"
        secondaryTitle="It’s up to SNT hodlers "
        secondaryDescription="The directory is curated by an autonomous dApp where SNT hodlers vote. So Status doesn’t have any control over which communities are featured."
      />
      <TwoColsSection
        title="Import from Discord"
        description="Does your community have an existing Discord server? All message history can be imported into Status."
        // TODO: explanation
        image="/assets/create-community/8.png"
        imageAlt="wallet-5"
        imageSecondary="/images/wallet/pizza.png"
        imageSecondaryAlt="pizza"
        secondaryTitle="Don’t lose those dank memes"
        secondaryDescription="When your community makes the switch to Status, no message from it’s old Discord is lost. So your community’s dank memes are safe. 😎"
        direction="rtl"
      />
    </Content>
  )
}

CreateCommunityPage.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>
}

export default CreateCommunityPage
