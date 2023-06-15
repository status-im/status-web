import { ContextTag, Text } from '@status-im/components'

import { ParalaxCircle } from './parallax-circle'

const VideoSection = () => {
  return (
    <div className="relative">
      <ParalaxCircle initialLeft={-100} initialTop={-100} />
      <div className="absolute right-[-5px] top-0 flex justify-center">
        <video autoPlay loop muted playsInline>
          <source
            src="/images/wallet/vitalik.mp4"
            type="video/mp4;codecs=hvc1"
          />
          <source src="/images/wallet/vitalik.webm" type="video/webm" />
        </video>
      </div>
      <div className="relative flex flex-col pl-[164px] pt-[240px]">
        <h1 className="text-[64px] font-bold leading-[68px]">
          Fully
          <br />
          Decentralized
          <br />
          Networks
        </h1>

        <div className="flex max-w-[462px] flex-col pt-4">
          <Text size={19}>
            Status supports blockchain networks that are fully committed to
            decentralization.
          </Text>
          <div className="pt-8">
            <Text size={13} color="$neutral-50" weight="medium">
              Currently supported networks
            </Text>
          </div>
          <div className="flex pt-3">
            <div className="pr-[10px]">
              <ContextTag
                type="network"
                network={{
                  name: 'Mainnet',
                  src: '/images/wallet/ethereum.png',
                }}
                size={24}
              />
            </div>
            <div className="pr-[10px]">
              <ContextTag
                type="network"
                network={{
                  name: 'Optmism',
                  src: '/images/wallet/optimism.png',
                }}
                size={24}
              />
            </div>
            <div>
              <ContextTag
                type="network"
                network={{
                  name: 'Arbitrum',
                  src: '/images/wallet/arbitrum.png',
                }}
                size={24}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { VideoSection }
