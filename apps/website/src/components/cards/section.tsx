import { Text } from '@status-im/components'
import { PopupIcon } from '@status-im/icons'
import { cva } from 'class-variance-authority'
import Image from 'next/image'

import { Border } from './border'

import type { StaticImageData } from 'next/image'

type Props = {
  direction?: 'ltr' | 'rtl'
  title: string
  description: string
  image: StaticImageData
  imageAlt: string
  imageSecondary: StaticImageData
  imageSecondaryAlt: string
  secondaryDescription: string
  secondaryTitle: string
  customNode?: React.ReactNode
  color: 'yellow' | 'turquoise' | 'purple'
  information?: string
}

const containerClassNames = cva(
  [
    'relative flex w-full justify-center',
    'overflow-hidden',
    'max-h-[854px]',
    'max-w-[582px]',
    'rounded-[32px]',
    'py-[65px]',
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
  ['rounded-3xl', 'border-4', 'h-auto max-h-[724px] w-auto'],
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

const Section = (props: Props) => {
  const {
    title,
    color,
    description,
    image,
    imageAlt,
    imageSecondary,
    imageSecondaryAlt,
    secondaryDescription,
    secondaryTitle,
    direction = 'ltr',
  } = props

  const directionOrder = direction === 'ltr' ? 'order-0' : 'order-1'

  return (
    <div className="flex justify-center">
      <div className="relative z-[3] grid auto-cols-auto grid-flow-dense auto-rows-[1fr] grid-cols-1 gap-24 px-5 md:grid-cols-2 lg:gap-12 lg:px-[100px] xl:gap-[140px]">
        <div
          className={`${directionOrder} flex max-w-[1504px] justify-center overflow-hidden rounded-[32px]`}
        >
          <div className={containerClassNames({ color })}>
            <div className={borderContainerClassNames({ color })}>
              <Border />
            </div>
            <div className="absolute left-0 top-0 h-full w-full bg-[url('/assets/wallet/texture.png')] bg-contain bg-[left_top_0] bg-no-repeat" />
            <Image
              src={image}
              alt={imageAlt}
              className={imageClassNames({ color })}
            />
          </div>
        </div>
        <div className="flex flex-col justify-start md:justify-center">
          <div className="flex flex-col">
            <Image
              src={imageSecondary}
              alt={imageSecondaryAlt}
              width={48}
              height={48}
            />

            <div className="flex flex-col pt-4">
              <Text size={27} weight="semibold">
                {title}
              </Text>
              <div className="relative flex pt-1">
                <Text size={27}>{description}</Text>
              </div>
            </div>

            <div className="mt-16 flex flex-col rounded-[20px] border border-dashed border-neutral-80/20 p-4">
              <Text size={19} weight="semibold">
                {secondaryTitle}
              </Text>
              <div className="flex pt-1">
                <Text size={19}>
                  {secondaryDescription}
                  {props.information && (
                    <span className="relative left-1 top-1 inline-block">
                      <PopupIcon size={20} color="$neutral-50" />
                    </span>
                  )}
                </Text>
              </div>

              {props.customNode && (
                <div className="mt-4 flex flex-col">{props.customNode}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Section }
