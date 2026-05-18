'use client'

import { Text } from '@status-im/components'
import { DownloadIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'

import { Image as AssetImage } from '~components/assets'

import { CopyHexButton } from './copy-hex-button'
import { DownloadImageButton } from './download-image-button'
import { DownloadZipButton } from './download-zip-button'

import type { ImageType, ZipFileId } from '~components/assets'

type BrandSectionProps = {
  title: string
  description: string
  children: React.ReactNode
  assetName: ZipFileId | false
  carousel?: boolean
}

function BrandSection(props: BrandSectionProps) {
  const { title, description, children, assetName, carousel } = props

  return (
    <section className="container relative z-20 py-12 xl:py-20">
      <div className="flex flex-col gap-5 pb-12 md:flex-row md:items-center md:justify-between 2md:gap-0 2md:pb-10">
        <div className="grid gap-1">
          <h2 className="text-27 font-semibold">{title}</h2>
          <Text size={27} weight="regular">
            {description}
          </Text>
        </div>

        {assetName && (
          <DownloadZipButton
            variant="outline"
            iconBefore={<DownloadIcon />}
            zipFileId={assetName}
          >
            Download
          </DownloadZipButton>
        )}
      </div>
      {carousel ? (
        <div
          className={cx([
            'grid max-w-[1504px] snap-x snap-mandatory scroll-px-5 grid-cols-[80%_80%_80%] gap-2 overflow-x-auto overflow-y-hidden scrollbar-none',
            'md:grid-cols-3 2md:gap-5',
            '-mx-5 xl:mx-0',
            'w-[calc(100%+40px)] xl:w-auto xl:snap-none',
            'px-5 xl:px-0',
          ])}
        >
          {children}
        </div>
      ) : (
        <div className="relative grid grid-cols-1 gap-5 2md:grid-cols-2 xl:grid-cols-4">
          {children}
        </div>
      )}
    </section>
  )
}

type LogoImage = ImageType & {
  gradient?: boolean
}

export function LogoSection(
  props: Omit<BrandSectionProps, 'children'> & {
    logos: LogoImage[]
    downloadLabel: string
    downloadAriaLabel: string
  }
) {
  const { logos, downloadLabel, downloadAriaLabel, ...sectionProps } = props

  return (
    <BrandSection {...sectionProps}>
      {logos.map((logo, index) => {
        const { gradient = false, ...imageProps } = logo
        const imageWidth = Number(imageProps.id.split(':')[1].slice(0, -1))
        const imageHeight = Number(imageProps.id.split(':')[2].slice(0, -1))

        return (
          <div
            key={index}
            data-background="blur"
            className="group relative flex items-center justify-center overflow-hidden rounded-20 border border-neutral-80/5 bg-white-100 py-12 shadow-1 xl:py-8"
          >
            <AssetImage
              {...imageProps}
              width={imageWidth}
              height={imageHeight}
              className="relative z-10"
            />
            {gradient && <Gradient />}
            <div className="pointer-events-none absolute left-0 top-0 z-[12] flex size-full items-center justify-center rounded-20 bg-white-40 opacity-[0%] transition-opacity xl:pointer-events-auto group-hover:xl:opacity-[100%] group-hover:xl:backdrop-blur-2xl">
              <DownloadImageButton
                variant="outline"
                iconBefore={<DownloadIcon />}
                imageId={imageProps.id}
              >
                {downloadLabel}
              </DownloadImageButton>
            </div>
            <div
              className="absolute right-3 top-3 block xl:hidden"
              {...(gradient && { 'data-theme': 'dark' })}
            >
              <DownloadImageButton
                variant="outline"
                icon={<DownloadIcon />}
                imageId={imageProps.id}
                aria-label={downloadAriaLabel}
              />
            </div>
          </div>
        )
      })}
    </BrandSection>
  )
}

type Color = {
  name: string
  rgb: { r: number; g: number; b: number }
  hex: string
  invert: boolean
}

export function ColorSection(
  props: Omit<BrandSectionProps, 'children' | 'assetName'> & {
    colors: Color[]
  }
) {
  const { colors, ...sectionProps } = props

  return (
    <BrandSection {...sectionProps} assetName={false}>
      {colors.map(({ hex, rgb, name, invert }) => {
        const textColor = invert ? '$neutral-100' : '$white-100'
        const textColorRgb = invert ? '$neutral-50' : '$white-60'

        return (
          <div
            key={name}
            style={{ background: hex }}
            className="group relative flex flex-col gap-12 rounded-20 border border-neutral-80/5 bg-white-100 p-5 shadow-1 transition-all hover:shadow-3"
          >
            <div
              className="absolute right-3 top-3 transition-opacity group-hover:opacity-[100%] lg:opacity-[0%]"
              {...(invert === false && {
                'data-theme': 'dark',
                'data-background': 'blur',
              })}
            >
              <CopyHexButton hex={hex} />
            </div>
            <Text size={19} weight="semibold" color={textColor}>
              {name}
            </Text>
            <div className="flex flex-col uppercase">
              <Text size={15} color={textColor} weight="medium">
                {hex}
              </Text>
              <Text size={15} color={textColorRgb}>
                RGB {[rgb.r, rgb.g, rgb.b].join(',')}
              </Text>
            </div>
          </div>
        )
      })}
    </BrandSection>
  )
}

export function AssetSection(
  props: Omit<BrandSectionProps, 'children'> & { assets: ImageType[] }
) {
  const { assets, ...sectionProps } = props

  return (
    <BrandSection {...sectionProps} carousel>
      {assets.map((asset, index) => (
        <div key={index} className="snap-center lg:w-auto lg:snap-none">
          <AssetImage
            {...asset}
            className="rounded-[24px] border-4 bg-neutral-80/5"
          />
        </div>
      ))}
    </BrandSection>
  )
}

function Gradient() {
  return (
    <svg
      viewBox="0 0 350 144"
      className="absolute inset-0"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_13972_22212)">
        <g filter="url(#filter0_f_13972_22212)">
          <ellipse
            cx="298.26"
            cy="166.273"
            rx="181.818"
            ry="205.714"
            fill="#1992D7"
          />
        </g>
        <g filter="url(#filter1_f_13972_22212)">
          <ellipse
            cx="158.01"
            cy="-21.2857"
            rx="181.818"
            ry="205.714"
            fill="#FF7D46"
          />
        </g>
        <g filter="url(#filter2_f_13972_22212)">
          <ellipse
            cx="370.61"
            cy="70.4502"
            rx="181.818"
            ry="160"
            fill="#F6B03C"
          />
        </g>
        <g filter="url(#filter3_f_13972_22212)">
          <ellipse
            cx="-20.1818"
            cy="106.45"
            rx="181.818"
            ry="160"
            fill="#7140FD"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_f_13972_22212"
          x="-3.55811"
          y="-159.441"
          width="603.636"
          height="651.428"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="60"
            result="effect1_foregroundBlur_13972_22212"
          />
        </filter>
        <filter
          id="filter1_f_13972_22212"
          x="-143.808"
          y="-347"
          width="603.636"
          height="651.428"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="60"
            result="effect1_foregroundBlur_13972_22212"
          />
        </filter>
        <filter
          id="filter2_f_13972_22212"
          x="68.7915"
          y="-209.55"
          width="603.636"
          height="560"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="60"
            result="effect1_foregroundBlur_13972_22212"
          />
        </filter>
        <filter
          id="filter3_f_13972_22212"
          x="-322"
          y="-173.55"
          width="603.636"
          height="560"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="60"
            result="effect1_foregroundBlur_13972_22212"
          />
        </filter>
        <clipPath id="clip0_13972_22212">
          <rect width="350" height="144" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}
