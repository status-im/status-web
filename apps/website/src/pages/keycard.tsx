import keycardImage from '@assets/homepage/illustration-keycard.png'
import sectionImage1 from '@assets/wallet/section-01.png'
import { Button, Tag, Text } from '@status-im/components'
import { KeycardIcon, PlayIcon } from '@status-im/icons'
import Image from 'next/image'

import { Section } from '@/components/cards'
import { FeatureList } from '@/components/feature-list'
import { VideoSection } from '@/components/video-section'
import { illustrations } from '@/config/illustrations'
import { stickers } from '@/config/stickers'
import { AppLayout, Content } from '@/layouts/app-layout'

import type { Page } from 'next'

const KeycardPage: Page = () => {
  return (
    <Content>
      <div className="relative grid grid-cols-2 items-center gap-[140px] overflow-hidden py-40">
        <Image
          src={keycardImage}
          alt="Hand holding a green keycard"
          width={742}
          height={720}
        />

        <div className="grid max-w-[518px]">
          <div className="mb-4 flex">
            <Tag size={32} label="Keycard" />
          </div>
          <h1 className="mb-6 text-88">Status is better with Keycard</h1>
          <Text size={27}>
            The most secure, simple and open hardware wallet
          </Text>

          <div className="flex">
            <div className="flex gap-2 rounded-2xl border border-dashed border-neutral-80/20 p-2">
              <Button variant="primary" iconAfter={<KeycardIcon size={20} />}>
                Get a Keycard
              </Button>
              <Button variant="outline" icon={<PlayIcon size={20} />}>
                Watch demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="container px-40 pb-20 pt-40">
          <h2 className="text-64">
            Intuitive security.
            <br />
            For everyday use.
          </h2>
        </div>
        <FeatureList list={FEATURE_LIST} />
      </div>

      <VideoSection
        title="Fully integrated with Status"
        description="Get offline private key management, transaction authorization, and two-factor authentication."
      />

      <div className="pb-20">
        <Section
          icon="skull"
          color="yellow"
          title="True multi-chain experience"
          description="All networks, all the time. See all your assets and NFTs in one place, even if spread across multiple blockchains."
          image={sectionImage1}
          imageAlt="wallet-2"
          secondaryTitle="Can be used as ‘single chain at a time’ wallet"
          secondaryDescription="You are in full control of what you own, and no one except your self can ever recover or access your private keys"
        />
        <Section
          icon="skull"
          color="yellow"
          title="Protect your identity"
          description="Keycard allows you to create a profile and login to Status in the most secure fashion."
          image={sectionImage1}
          imageAlt="wallet-2"
          secondaryTitle="Easily migrate to a new device"
          secondaryDescription="Holding keycard and your pin code, you can migrate your whole Status experience to a new device"
          reverse
        />
      </div>

      <div className="relative border-t border-dashed border-neutral-30">
        <Image
          {...stickers.cube}
          alt={stickers.cube.alt}
          className="absolute bottom-8 left-8"
        />
        <Image
          {...stickers.gamepad}
          alt={stickers.gamepad.alt}
          className="absolute left-1/2 top-0 -translate-y-1/2"
        />
        <Image
          {...stickers.megaphone}
          alt={stickers.megaphone.alt}
          className="absolute right-8 top-8"
        />

        <div className="container flex justify-center divide-x divide-dashed divide-neutral-30 lg:px-30">
          {PREFOOTER_LIST.map(({ title, description, tags }) => (
            <div key={title} className="px-10 py-40">
              <div className="mb-6 gap-1">
                <h3>
                  <Text size={27} weight="semibold">
                    {title}
                  </Text>
                </h3>
                <Text size={19}>{description}</Text>
              </div>
              <div className="flex gap-2">
                {tags.map(tag => (
                  <Tag key={tag} size={32} label={tag} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Content>
  )
}

const FEATURE_LIST = [
  {
    title: 'Top tier security',
    description:
      'Our hardware security successfully passed Common Criteria EAL6+ certification ',
    icon: illustrations.doge,
  },
  {
    title: 'Keys stored in the card',
    description:
      'It’s impossible for Status or any government to extract your private keys from keycard',
    icon: illustrations.mushroom,
  },
  {
    title: 'Feature 3',
    description:
      'Here will say something more about security and how kc is revolutionary when it comes to security',
    icon: illustrations.hand,
  },
  {
    title: 'Mobile friendly',
    description:
      'Keycard is using NFC which is natively embedded in all mobile phones',
    icon: illustrations.duck,
  },
  {
    title: 'No need to charge',
    description: 'Keycard has no battery so it’s always ready to go.',
    icon: illustrations.flower,
  },
  {
    title: 'Easy to carry around',
    description:
      'Its credit card form factor is small and convenient to fit in any wallet.',
    icon: illustrations.megaphone,
  },
]

const PREFOOTER_LIST = [
  {
    title: 'Open standards',
    description:
      'We use key management that is following open and commonly used standards. ',
    tags: ['bip-32', 'bip-39', 'bip-44'],
  },
  {
    title: 'Easy to integrate',
    description:
      'Integrate keycard as a hardware wallet with your mobile or desktop apps with our SDKs.',
    tags: ['Walleth', 'EnnoWallet'],
  },
  {
    title: 'Full customizable',
    description:
      'We can support you with design, manufacturing, and fulfillment of your custom cards.',
    tags: ['getkeycard@status.im'],
  },
] as const

KeycardPage.getLayout = page => <AppLayout>{page}</AppLayout>

export default KeycardPage
