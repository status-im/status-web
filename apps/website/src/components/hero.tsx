import { Button, Tag, Text } from '@status-im/components'
import { DownloadIcon, WalletIcon } from '@status-im/icons'
import Image from 'next/image'

import type { StaticImageData } from 'next/image'

type Props = {
  type: 'Communities' | 'Create Community' | 'Wallet' | 'Messenger'
  title: string
  description: string
  color: string
  images: [StaticImageData, StaticImageData, StaticImageData, StaticImageData]
}

export const Hero = (props: Props) => {
  const { type, title, description, color, images } = props

  return (
    <>
      <div className="relative mb-16 grid px-5 pb-24 pt-16 lg:mb-24 lg:px-40 lg:pt-[120px]">
        {/* <ParalaxCircle initialLeft={-206} initialTop={-170} /> */}
        <div className="relative flex flex-col items-center justify-center">
          <div className="inline-flex">
            <Tag size={32} icon={WalletIcon} color="$yellow-50" label={type} />
          </div>
          <h1 className="max-w-[1000px] py-4 pb-4 text-center text-[48px] font-bold leading-[50px] lg:pb-5 lg:text-[88px] lg:leading-[84px]">
            {title}
          </h1>
          <span className="max-w-md text-center font-bold">
            <Text size={19}>{description}</Text>
          </span>
        </div>

        <div className="relative flex justify-center">
          <div className="border-neutral-80/20 mt-6 inline-flex rounded-[20px] border border-dashed p-2 lg:mt-16">
            <Button size={40} icon={<DownloadIcon size={20} />}>
              Sign up for early access
            </Button>
          </div>
        </div>
      </div>

      <div className="relative z-[2] flex justify-center px-10">
        <div className="grid max-w-[1504px] auto-rows-[1fr] grid-cols-3 gap-[19px]">
          <div className="row-span-2">
            <div className="bg-customisation-yellow/10 rounded-[40px] px-[73px] py-[68px]">
              <Image quality={90} src={images[0]} alt="" />
            </div>
          </div>
          <div className="row-span-2">
            <div className="bg-customisation-yellow/10 rounded-[40px] px-[73px] py-[68px]">
              <Image
                quality={90}
                src={images[1]}
                alt="wallet-2"
                className="border-customisation-yellow/5 rounded-3xl border-4"
              />
            </div>
          </div>
          <div>
            <div className="bg-customisation-yellow/10 flex h-full items-end justify-end rounded-[40px] px-[73px] pt-[68px]">
              <Image
                quality={90}
                src={images[2]}
                alt="wallet-3"
                className="border-customisation-yellow/5 rounded-3xl rounded-b-none border-4 border-b-0"
              />
            </div>
          </div>
          <div>
            <div className="bg-customisation-yellow/10 flex h-full items-center justify-center rounded-[40px] px-[73px]">
              <Image quality={90} src={images[3]} alt="wallet-4" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
