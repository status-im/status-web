import { Button, Tag, Text } from '@status-im/components'
import { DownloadIcon, WalletIcon } from '@status-im/icons'
import Image from 'next/image'

import communitySrc from '../../../public/assets/features/messenger/community.png'
import composerSrc from '../../../public/assets/features/messenger/composer.png'
import messagesSrc from '../../../public/assets/features/messenger/messages.png'
import messagesSettingsSrc from '../../../public/assets/features/messenger/messages-settings.png'
import { ParalaxCircle } from './parallax-circle'

const HeroSection = () => {
  return (
    <>
      <div className="relative mb-16 grid px-5 lg:mb-24 lg:px-40">
        <ParalaxCircle initialLeft={-206} initialTop={-170} />
        <div className="relative flex flex-col items-center justify-center">
          <div className="inline-flex">
            <Tag
              size={32}
              icon={WalletIcon}
              color="$purple-50"
              label="Wallet"
            />
          </div>
          <h1 className="py-4 pb-4 text-center text-[48px] font-bold leading-[50px] lg:pb-5 lg:text-[88px] lg:leading-[84px]">
            Chat privately
            <br />
            with friends
          </h1>
          <span className="max-w-md text-center">
            <Text size={19} weight="regular">
              Protect your right to free speech. 1:1 and group chats with e2e
              encryption, perfect forward secrecy and metadata privacy.
            </Text>
          </span>
        </div>

        <div className="relative flex justify-center">
          <div className="border-neutral-80/20 mt-6 inline-flex rounded-[20px] border border-dashed p-2 lg:mt-16">
            <Button
              size={40}
              icon={<DownloadIcon size={20} />}
              customColors={{
                backgroundColor: '$purple-50',
                color: '$white-100',
                hoverStyle: { backgroundColor: '$purple-60' },
                pressStyle: { backgroundColor: '$purple-50' },
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
            <div className="bg-customisation-purple/10 rounded-[40px] px-[73px] py-[68px]">
              <Image
                src={messagesSrc}
                quality={100}
                alt="wallet-1"
                className="border-customisation-purple/10 rounded-3xl border-4"
              />
            </div>
          </div>
          <div className="row-span-2">
            <div className="bg-customisation-purple/10 rounded-[40px] px-[73px] py-[68px]">
              <Image
                src={communitySrc}
                quality={100}
                alt="wallet-2"
                className="border-customisation-purple/5 rounded-3xl border-4"
              />
            </div>
          </div>
          <div>
            <div className="bg-customisation-purple/10 flex h-full items-end justify-end rounded-[40px] px-[73px] pt-[68px]">
              <Image
                src={messagesSettingsSrc}
                quality={100}
                alt="wallet-3"
                className="border-customisation-purple/5 rounded-3xl rounded-b-none border-4 border-b-0"
              />
            </div>
          </div>
          <div>
            <div className="bg-customisation-purple/10 flex h-full items-center justify-center rounded-[40px] px-[73px]">
              <Image src={composerSrc} alt="wallet-4" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export { HeroSection }
