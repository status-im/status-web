import { cx } from 'cva'
import Image from 'next/image'
import { BrandSection, BrandSectionProps } from './brand-section'
import { Gradient } from './gradient'

type LogoImage = {
  alt: string
  src: string
  width: number
  height: number
  className?: string
  gradient?: boolean
}

const LogoSection = (
  props: Omit<BrandSectionProps, 'children'> & {
    logos?: LogoImage[]
  },
) => {
  const { logos, ...sectionProps } = props

  return (
    <BrandSection {...sectionProps}>
      {logos?.map((logo, index) => {
        const { gradient = false, ...imageProps } = logo

        return (
          <div
            key={index}
            className="relative flex items-center justify-center overflow-hidden rounded-20 border border-neutral-80/5 bg-white-100 px-5 py-12 shadow-1 lg:py-8"
          >
            <Image
              className={cx('relative z-10 w-full', imageProps.className)}
              width={imageProps.width}
              height={imageProps.height}
              alt={imageProps.alt}
              src={imageProps.src}
            />
            {gradient && <Gradient />}
          </div>
        )
      })}
    </BrandSection>
  )
}

export { LogoSection }
