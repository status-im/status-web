import { ContextTag, Text } from '@status-im/components'

import { ParalaxCircle } from './parallax-circle'

const VideoSection = () => {
  return (
    <div className="relative flex flex-col md:flex-row">
      <ParalaxCircle initialLeft={-100} initialTop={-100} />

      <div className="relative z-[1] flex flex-col gap-4 px-5 pt-24 lg:px-[164px] lg:pt-[240px]">
        <h2 className="text-[40px] font-bold leading-[44px] lg:text-[64px] lg:leading-[68px]">
          Fully
          <br />
          Decentralized
          <br />
          Messaging
        </h2>

        <div className="max-w-[472px]">
          <Text size={27}>
            Status’ Waku p2p messaging network is powered by people running
            Status Desktop - true decentralisation.
          </Text>
        </div>
      </div>

      <div className="relative right-[-5px] top-0 flex justify-center md:absolute">
        {/* <video autoPlay loop muted playsInline>
          <source
            src="/images/wallet/vitalik.mp4"
            type="video/mp4;codecs=hvc1"
          />
          <source src="/images/wallet/vitalik.webm" type="video/webm" />
        </video> */}
      </div>
    </div>
  )
}

export { VideoSection }
