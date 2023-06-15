import { Button, Tag, Text } from '@status-im/components'
import { DownloadIcon, WalletIcon } from '@status-im/icons'

import { ParalaxCircle } from './parallax-circle'

const HeroSection = () => {
  return (
    <>
      <div className="relative mx-40 mb-24 grid gap-8">
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
          <h1 className="max-w-[600px] py-4 pb-5 text-center text-[88px] font-bold leading-[84px]">
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
          <div className="border-neutral-80/20 mt-16 inline-flex rounded-[20px] border border-dashed p-2">
            <Button
              size={40}
              icon={<DownloadIcon size={20} />}
              customColors={{
                backgroundColor: '$yellow-50',
                color: '$white-100',
                hoverStyle: { backgroundColor: '$yellow-60' },
                pressStyle: { backgroundColor: '$yellow-50' },
              }}
            >
              Sign up for early access
            </Button>
          </div>
        </div>
      </div>

      <div className="relative z-[2] flex justify-center px-10">
        <div className="grid max-w-[1504px] auto-rows-[1fr] grid-cols-3 gap-[19px]">
          <div className="row-span-2">
            <div className="bg-customisation-yellow/10 rounded-[40px] px-[73px] py-[68px]">
              <img
                src="/images/wallet/1.png"
                alt="wallet-1"
                className="border-customisation-yellow/10 rounded-3xl border-4"
              />
            </div>
          </div>
          <div className="row-span-2">
            <div className="bg-customisation-yellow/10 rounded-[40px] px-[73px] py-[68px]">
              <img
                src="/images/wallet/2.png"
                alt="wallet-2"
                className="border-customisation-yellow/5 rounded-3xl border-4"
              />
            </div>
          </div>
          <div>
            <div className="bg-customisation-yellow/10 flex h-full items-end justify-end rounded-[40px] px-[73px] pt-[68px]">
              <img
                src="/images/wallet/3.png"
                alt="wallet-3"
                className="border-customisation-yellow/5 rounded-3xl rounded-b-none border-4 border-b-0"
              />
            </div>
          </div>
          <div>
            <div className="bg-customisation-yellow/10 flex h-full items-center justify-center rounded-[40px] px-[73px]">
              <img src="/images/wallet/wallet-4.png" alt="wallet-4" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export { HeroSection }
