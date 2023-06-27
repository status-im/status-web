import { Button, Tag, Text } from '@felicio/components'
import { DownloadIcon, WalletIcon } from '@felicio/icons'
import image1 from 'public/assets/wallet/1.png'
import image2 from 'public/assets/wallet/2.png'
import image3 from 'public/assets/wallet/3.png'
import image4 from 'public/assets/wallet/vegas.png'

import { GridHero } from '../cards/grid-hero'
import { ParalaxCircle } from './parallax-circle'

const HeroSection = () => {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="relative mb-16 grid px-5 lg:mb-24 lg:px-40">
        <ParalaxCircle initialLeft={-206} initialTop={-170} />
        <div className="relative flex flex-col items-center justify-center">
          <div className="inline-flex">
            <Tag
              size={32}
              icon={WalletIcon}
              color="$yellow-50"
              label="Wallet"
            />
          </div>
          <h1 className="max-w-[600px] py-4 text-center text-[48px] font-bold leading-[50px] lg:pb-5 lg:text-[88px] lg:leading-[84px]">
            The future
            <br />
            is multi-chain
          </h1>
          <span className="max-w-md text-center font-bold">
            <Text size={19}>
              L2s made simple - send and manage your crypto easily and safely
              across multiple networks.
            </Text>
          </span>
        </div>

        <div className="relative flex justify-center">
          <div className="mt-6 inline-flex rounded-[20px] border border-dashed border-neutral-80/20 p-2 lg:mt-8">
            <Button
              size={40}
              icon={<DownloadIcon size={20} />}
              variant="yellow"
            >
              Sign up for early access
            </Button>
          </div>
        </div>
      </div>
      <GridHero
        color="yellow"
        cardOne={{
          alt: 'wallet-1',
          image: image1,
        }}
        cardTwo={{
          alt: 'wallet-2',
          image: image2,
        }}
        cardThree={{
          alt: 'wallet-3',
          image: image3,
        }}
        cardFour={{
          alt: 'wallet-4',
          image: image4,
        }}
      />
    </div>
  )
}

export { HeroSection }
