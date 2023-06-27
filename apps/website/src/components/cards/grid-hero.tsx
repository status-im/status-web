import { cva } from 'class-variance-authority'
import Image from 'next/image'

import type { StaticImageData } from 'next/image'

// Variants for the grid hero class names
const biggerCardClassNames = cva(
  [
    'min-w-[350px] rounded-[40px]',
    'px-[22px] py-6 sm:min-w-0 sm:px-[35px] sm:py-[48px] lg:px-5 xl:px-[34px] xl:py-[68px] 2xl:px-[73px]',
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

const imagesWithBorders = cva(['border-4', 'rounded-3xl'], {
  variants: {
    color: {
      yellow: ['border-customisation-yellow/5'],
      turquoise: ['border-customisation-turquoise/5'],
      purple: ['border-customisation-purple/5'],
    },
  },
})

const imagesWithBordersTopOrBottom = cva(['border-4', 'rounded-3xl'], {
  variants: {
    color: {
      yellow: ['border-customisation-yellow/5'],
      turquoise: ['border-customisation-turquoise/5'],
      purple: ['border-customisation-purple/5'],
    },
    alignment: {
      top: ['border-t-0'],
      bottom: ['border-b-0'],
    },
  },
})

const thirdCardClassNames = cva(
  [
    'flex min-w-[calc(50%-10px)] rounded-[40px]',
    'px-[22px] sm:min-w-0 sm:px-[35px] lg:px-5 xl:px-[34px]  2xl:px-[73px]',
  ],
  {
    variants: {
      color: {
        yellow: ['bg-customisation-yellow/10'],
        turquoise: ['bg-customisation-turquoise/10'],
        purple: ['bg-customisation-purple/10'],
      },
      alignment: {
        top: [
          'pt-0',
          'pb-6 sm:pb-[48px] xl:pb-[68px]',
          'items-start',
          'justify-start',
        ],
        bottom: [
          'pb-0',
          'pt-6 sm:pt-[48px] xl:pt-[68px]',
          'items-end',
          'justify-end',
        ],
      },
    },
  }
)

const fourthCardClassNames = cva(
  [
    'flex min-w-[calc(50%-10px)] rounded-[40px]',
    'grow items-center justify-center px-0 sm:px-5 md:px-10 lg:px-5 2xl:px-10',
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

type Props = {
  color: 'yellow' | 'turquoise' | 'purple'
  cardOne: {
    image: StaticImageData
    alt: string
  }
  cardTwo: {
    image: StaticImageData
    alt: string
  }
  cardThree: {
    image: StaticImageData
    alt: string
    alignment?: 'top' | 'bottom'
  }
  cardFour: {
    image: StaticImageData
    alt: string
  }
}

const GridHero = (props: Props) => {
  const { color, cardOne, cardTwo, cardThree, cardFour } = props

  return (
    <div className="relative z-[2] flex w-full max-w-[1504px] justify-start overflow-x-auto px-5 sm:justify-center sm:px-10">
      <div className="flex min-w-[712px] flex-row gap-3 sm:min-w-fit sm:flex-col sm:gap-5 lg:flex-row">
        <div className="flex flex-row gap-3 sm:gap-5">
          <div className={biggerCardClassNames({ color })}>
            <Image
              src={cardOne.image}
              alt={cardOne.alt}
              className={imagesWithBorders({ color })}
            />
          </div>
          <div className={biggerCardClassNames({ color })}>
            <Image
              src={cardTwo.image}
              alt={cardTwo.alt}
              className={imagesWithBorders({ color })}
            />
          </div>
        </div>
        <div className="flex min-w-[350px] flex-col gap-3 pr-5 sm:min-w-0 sm:flex-row sm:gap-5 sm:pr-0 lg:flex-col">
          <div
            className={thirdCardClassNames({
              color,
              alignment: cardThree.alignment || 'bottom',
            })}
          >
            <Image
              src={cardThree.image}
              alt={cardThree.alt}
              className={imagesWithBordersTopOrBottom({
                color,
                alignment: cardThree.alignment || 'bottom',
              })}
            />
          </div>
          <div className={fourthCardClassNames({ color })}>
            <Image src={cardFour.image} alt={cardFour.alt} />
          </div>
        </div>
      </div>
    </div>
  )
}

export { GridHero }
