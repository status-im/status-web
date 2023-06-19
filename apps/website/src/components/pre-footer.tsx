import { Button, Text } from '@status-im/components'
import { DownloadIcon } from '@status-im/icons'
import Image from 'next/image'

import logoSrc from '../../public/images/logo/default.svg'
import { ComingSoon } from './coming-soon'

const Prefooter = () => {
  return (
    <div className="bg-neutral-100 p-5 pb-[120px] pt-[120px]">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Image src={logoSrc} alt="Status logo" width={80} />
          <h1 className="text-white-100 py-4 pb-3 pt-5 text-center text-[40px] font-bold leading-[44px] lg:pb-5 lg:text-[88px] lg:leading-[84px]">
            Be unstoppable
          </h1>
          <span className="max-w-md text-center font-bold">
            <Text size={19} color={'$white-100'}>
              Use the open source, decentralized crypto communication super app.
            </Text>
          </span>
          <div className="relative flex flex-col justify-center pt-8">
            <div className="inline-flex justify-center">
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
            <div className="relative max-w-xs pt-4 text-center leading-3">
              <Text size={11} color={'$neutral-40'}>
                Betas for Mac, Windows, Linux <br />
                Alphas for iOS & Android
              </Text>
              <div className="absolute right-[-48px] top-9">
                <ComingSoon />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Prefooter }
