import { Text } from '@status-im/components'
import { cx } from 'class-variance-authority'
import Image from 'next/image'

import type { StaticImageData } from 'next/image'

// import { ParalaxCircle } from './parallax-circle'

type Props = {
  title: string
  description: string
  image?: StaticImageData
  dark?: boolean
}

const VideoSection = (props: Props) => {
  const { title, description, image, dark } = props

  return (
    <div className="container relative pb-48 pt-60 md:flex">
      {/* <ParalaxCircle initialLeft={-100} initialTop={-100} /> */}

      <div className="relative z-[1] flex flex-col">
        <div className="flex max-w-[480px] flex-col gap-4">
          <h2 className={cx('text-40 lg:text-64', dark && 'text-white-100')}>
            {title}
          </h2>
          <Text size={27} color={dark ? '$white-100' : ''}>
            {description}
          </Text>
        </div>
      </div>
      <div className="relative right-0 top-0 flex justify-center md:absolute">
        {image && <Image src={image} alt="TODO" />}
        {/* <video autoPlay loop muted playsInline>
          <source
            src="/assets/wallet/vitalik.mp4"
            type="video/mp4;codecs=hvc1"
          />
          <source src="/assets/wallet/vitalik.webm" type="video/webm" />
        </video> */}
      </div>
    </div>
  )
}

export { VideoSection }
