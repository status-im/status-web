import { Button, Tag, Text } from '@status-im/components'
import { DownloadIcon, WalletIcon } from '@status-im/icons'

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
          <h1 className="max-w-[600px] py-4 pb-4 text-center text-[48px] font-bold leading-[50px] lg:pb-5 lg:text-[88px] lg:leading-[84px]">
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
          <div className="border-neutral-80/20 mt-6 inline-flex rounded-[20px] border border-dashed p-2 lg:mt-8">
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
          image: '/assets/wallet/1.png',
        }}
        cardTwo={{
          alt: 'wallet-2',
          image: '/assets/wallet/2.png',
        }}
        cardThree={{
          alt: 'wallet-3',
          image: '/assets/wallet/3.png',
          alignment: 'top',
        }}
        cardFour={{
          alt: 'wallet-4',
          image: '/assets/wallet/vegas.png',
        }}
      />
    </div>
  )
}

export { HeroSection }
