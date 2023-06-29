import { cva } from 'class-variance-authority'
import Image from 'next/image'

import { Border } from './cards/border'

import type { StaticImageData } from 'next/image'

type Props = {
  image: StaticImageData
  alt: string
  color: 'yellow' | 'turquoise' | 'purple'
}

const containerClassNames = cva(
  [
    'relative flex max-h-[854px] w-[582px] max-w-[582px] justify-center overflow-hidden rounded-[40px] py-[65px]',
  ],
  {
    variants: {
      color: {
        yellow: ['bg-customisation-yellow/10'],
        turquoise: ['bg-customisation-turquoise/10'],
        purple: ['bg-customisation-purple/10'],
      },
    },
  }
)

const imageClassNames = cva(
  ['rounded-3xl', 'h-auto max-h-[724px] w-auto border-4'],
  {
    variants: {
      color: {
        yellow: ['border-customisation-yellow/5'],
        turquoise: ['border-customisation-turquoise/5'],
        purple: ['border-customisation-purple/5'],
      },
    },
  }
)

const borderContainerClassNames = cva(
  ['absolute left-0 top-0', 'w-full', 'h-[100%]'],
  {
    variants: {
      color: {
        yellow: ['text-customisation-yellow/5'],
        turquoise: ['text-customisation-turquoise/5'],
        purple: ['text-customisation-purple/5'],
      },
    },
  }
)

export const ScreenshotImage = (props: Props) => {
  const { image, color } = props

  return (
    <div className={containerClassNames({ color })}>
      <div className={borderContainerClassNames({ color })}>
        <Border />
      </div>
      <div className="absolute left-0 top-0 h-full w-full bg-[url('/assets/wallet/texture.png')] bg-contain bg-[left_top_0] bg-no-repeat" />
      <Image
        src={image}
        alt={props.alt}
        className={imageClassNames({ color })}
      />
    </div>
  )
}
