import { Text } from '@status-im/components'
import { PopupIcon } from '@status-im/icons'
import { cva, cx } from 'class-variance-authority'
import Image from 'next/image'

import { type Illustration, illustrations } from '@/config/illustrations'

import { Border } from './border'

import type { StaticImageData } from 'next/image'

type Props = {
  icon: Illustration
  title: string
  description: string
  secondaryTitle: string
  secondaryDescription: string
  image: StaticImageData
  imageAlt: string
  customNode?: React.ReactNode
  color: 'yellow' | 'turquoise' | 'purple' | 'none'
  information?: string
  direction?: 'ltr' | 'rtl'
  reverse?: boolean
}

const containerClassNames = cva(
  [
    'relative flex w-[582px] justify-center',
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

const Section = (props: Props) => {
  const {
    title,
    color,
    description,
    image,
    imageAlt,
    icon,
    secondaryDescription,
    secondaryTitle,
    direction = 'ltr',
    reverse = direction === 'rtl',
  } = props

  const directionOrder = direction === 'ltr' ? 'order-0' : 'order-1'

  const illustration = illustrations[icon]

  return (
    <div className="flex justify-center py-20">
      <div className="relative z-[3]">
        <div
          className={cx([
            'flex items-center lg:gap-12 lg:px-[100px] xl:gap-[140px]',
            reverse && 'flex-row-reverse',
          ])}
        >
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

          <div className="flex max-w-[462px] flex-col justify-start md:justify-center">
            <div className="flex flex-col">
              <Image {...illustration} alt={illustration.alt} />

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
    </div>
  )
}

export { Section }
