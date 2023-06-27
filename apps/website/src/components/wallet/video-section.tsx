import { ContextTag, Text } from '@status-im/components'

import { ParalaxCircle } from '../parallax-circle'

const VideoSection = () => {
  return (
    <div className="relative flex flex-col md:flex-row">
      <ParalaxCircle
        color="bg-customisation-yellow-50"
        left={-100}
        top={-100}
      />

      <div className="relative z-[1] flex flex-col px-5 pt-24 lg:px-[164px] lg:pt-[240px]">
        <h2 className="text-40 lg:text-64">
          Fully
          <br />
          Decentralized
          <br />
          Networks
        </h2>

        <div className="flex max-w-[462px] flex-col pt-4">
          <Text size={27}>
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
                  src: '/assets/wallet/ethereum.png',
                }}
                size={24}
              />
            </div>
            <div className="pr-[10px]">
              <ContextTag
                type="network"
                network={{
                  name: 'Optmism',
                  src: '/assets/wallet/optimism.png',
                }}
                size={24}
              />
            </div>
            <div>
              <ContextTag
                type="network"
                network={{
                  name: 'Arbitrum',
                  src: '/assets/wallet/arbitrum.png',
                }}
                size={24}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="relative right-[-5px] top-0 flex justify-center md:absolute">
        <video autoPlay loop muted playsInline>
          <source
            src="/assets/wallet/vitalik.mp4"
            type="video/mp4;codecs=hvc1"
          />
          <source src="/assets/wallet/vitalik.webm" type="video/webm" />
        </video>
      </div>
    </div>
  )
}

export { VideoSection }
