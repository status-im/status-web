import { customisation, neutral, white } from '@status-im/colors'
import { Text } from '@status-im/components'
import { DownloadIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'

import { Metadata } from '~app/_metadata'
import { rgbToHex } from '~app/_utils/rgb-to-hex'
import { Image as AssetImage } from '~components/assets'
import { Body } from '~components/body'
import { ParallaxCircle } from '~website/_components/parallax-circle'

import { HeroSection } from '../_components/hero-section'
import { CopyHexButton } from './_components/copy-hex-button'
import { DownloadImageButton } from './_components/download-image-button'
import { DownloadZipButton } from './_components/download-zip-button'

import type { ImageType, ZipFileId } from '~components/assets'

export const metadata = Metadata({
  title: 'Brand',
  description: 'Get Status brand assets.',
})

const transformColor = (name: string, rgba: string, invert = false) => {
  const [r, g, b] = rgba.match(/\d+/g)!.map(Number)
  return {
    name,
    rgb: { r, g, b },
    hex: rgbToHex({ r, g, b }),
    invert,
  }
}

export default function BrandPage() {
  return (
    <Body className="relative">
      <ParallaxCircle
        color="purple"
        className="left-[-338px] top-[-338px] xl:left-[-270px] xl:top-[-56px]"
      />
      <ParallaxCircle
        color="sky"
        className="left-[-382px] top-[192px] xl:left-[240px] xl:top-[-454px]"
      />
      <ParallaxCircle
        color="orange"
        className="left-[82px] top-[136px] xl:left-[250px] xl:top-[178px]"
      />
      <ParallaxCircle
        color="yellow"
        className="left-[49px] right-auto top-[1300px] xl:left-auto xl:right-[100px] xl:top-[560px]"
      />
      <HeroSection
        tag="Brand"
        title="Get Status brand assets"
        className="relative z-20 pb-12 xl:pb-30"
        action={
          <div className="flex w-full flex-col gap-3 rounded-16 border border-dashed border-neutral-80/20 bg-white-20 p-2 pl-3 sm:max-w-[462px] sm:flex-row sm:items-center sm:gap-10">
            <Text size={13}>
              This ZIP file contains Status logos, partnership badges, and
              product assets.
            </Text>

            <DownloadZipButton
              iconBefore={<DownloadIcon />}
              zipFileId="Brand/brand-assets.zip"
            >
              Download
            </DownloadZipButton>
          </div>
        }
      />

      <div className="relative border-b border-dashed border-neutral-80/20 pb-12 xl:pb-20">
        <LogoSection
          title="Our logo"
          description="With typo in multiple versions"
          assetName="Brand/logo-assets.zip"
          logos={[
            {
              id: 'Brand/Logo Section/Logo/Logo_01:1640:480',
              alt: '',
            },
            {
              id: 'Brand/Logo Section/Logo/Logo_02:1640:480',
              alt: '',
            },
            {
              id: 'Brand/Logo Section/Logo/Logo_03:1640:480',
              alt: '',
            },
            {
              id: 'Brand/Logo Section/Logo/Logo_04:1640:480',
              alt: '',
              gradient: true,
            },
          ]}
        />
        <LogoSection
          title="Mark only"
          description="Without typo in multiple versions"
          assetName="Brand/mark-assets.zip"
          logos={[
            { id: 'Brand/Logo Section/Mark/Mark_01:480:480', alt: '' },
            { id: 'Brand/Logo Section/Mark/Mark_02:480:480', alt: '' },
            { id: 'Brand/Logo Section/Mark/Mark_03:480:480', alt: '' },
            {
              id: 'Brand/Logo Section/Mark/Mark_04:480:480',
              alt: '',
              gradient: true,
            },
          ]}
        />
        <LogoSection
          title="Other variants"
          description="With and without typo"
          assetName="Brand/variant-assets.zip"
          logos={[
            {
              id: 'Brand/Logo Section/Variants/Logo/Logo_01:1640:480',
              alt: '',
            },
            { id: 'Brand/Logo Section/Variants/Mark/Mark_01:480:480', alt: '' },
            {
              id: 'Brand/Logo Section/Variants/Logo/Logo_02:1640:480',
              alt: '',
            },
            { id: 'Brand/Logo Section/Variants/Mark/Mark_02:480:480', alt: '' },
            {
              id: 'Brand/Logo Section/Variants/Logo/Logo_03:1640:480',
              alt: '',
            },
            { id: 'Brand/Logo Section/Variants/Mark/Mark_03:480:480', alt: '' },
          ]}
        />
        <ParallaxCircle
          color="blue"
          className="bottom-[-317px] left-[-311px] xl:bottom-[-48px] xl:left-[358px]"
        />
      </div>

      <div className="relative border-b border-dashed border-neutral-80/20 bg-white-100 py-12 xl:py-20">
        <ColorSection
          title="Main colors"
          description="Our main colors palette"
          colors={[
            transformColor('Dark', neutral['100']),
            transformColor('White', white['100'], true),
            transformColor('Blue', customisation.blue['50']),
          ]}
        />
        <ColorSection
          title="Custom colors"
          description="Our accent colors"
          colors={[
            transformColor('Purple', customisation.purple['50']),
            transformColor('Orange', customisation.orange['50']),
            transformColor('Army', customisation.army['50']),
            transformColor('Turquoise', customisation.turquoise['50']),
            transformColor('Sky', customisation.sky['50']),
            transformColor('Yellow', customisation.yellow['50']),
            transformColor('Pink', customisation.pink['50']),
            transformColor('Copper', customisation.copper['50']),
            transformColor('Camel', customisation.camel['50']),
            transformColor('Magenta', customisation.magenta['50']),
          ]}
        />
        <ParallaxCircle
          color="purple"
          className="left-[-250px] top-[538px] xl:top-[257px]"
        />
        <ParallaxCircle
          color="pink"
          className="bottom-[-240px] right-[-46px] xl:bottom-[-270px] xl:right-[48px]"
        />
      </div>

      <div className="relative border-b border-dashed border-neutral-80/20 bg-white-100 py-12 xl:py-20">
        <AssetSection
          title="Product assets"
          description="Screenshots of our product"
          assetName="Brand/product-assets.zip"
          assets={[
            {
              id: 'Brand/Product Assets/Other/Asset_Other_04:750:1624',
              alt: 'Mobile app screenshot showing the profile assets in the Status app',
            },
            {
              id: 'Brand/Product Assets/Communities/Asset_Communities_02:750:1624',
              alt: 'Mobile app screenshot showing the community feature assets in the Status app',
            },
            {
              id: 'Brand/Product Assets/Wallet/Asset_Wallet_05:750:1624',
              alt: 'Mobile app screenshot showing the wallet feature assets in the Status app',
            },
          ]}
        />
        <div className="absolute left-1/2 top-0 size-full -translate-x-1/2 bg-gradient-to-t from-customisation-blue-50/5 to-transparent" />
      </div>

      <div className="container py-24 xl:py-40">
        <div className="mx-auto flex max-w-[606px] flex-col items-center">
          <h3 className="mb-4 text-center text-40 font-bold xl:text-64">
            Download assets
          </h3>
          <div className="mb-8 max-w-[484px] text-center">
            <Text size={27}>
              This ZIP file contains Status logo, variants, and product assets.
            </Text>
          </div>
          <DownloadZipButton
            iconBefore={<DownloadIcon />}
            zipFileId="Brand/brand-assets.zip"
          >
            Download
          </DownloadZipButton>
        </div>
      </div>
    </Body>
  )
}

type BrandSectionProps = {
  title: string
  description: string
  children: React.ReactNode
  assetName: ZipFileId | false
  carousel?: boolean
}

const BrandSection = (props: BrandSectionProps) => {
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

const LogoSection = (
  props: Omit<BrandSectionProps, 'children'> & {
    logos: LogoImage[]
  }
) => {
  const { logos, ...sectionProps } = props

  return (
    <BrandSection {...sectionProps}>
      {logos.map((logo, index) => {
        const { gradient = false, ...imageProps } = logo
        // Gets the width from the image id string and converts it to a number
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
                Download
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
                aria-label="Download image"
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

const ColorSection = (
  props: Omit<BrandSectionProps, 'children' | 'assetName'> & {
    colors: Color[]
  }
) => {
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

const AssetSection = (
  props: Omit<BrandSectionProps, 'children'> & { assets: ImageType[] }
) => {
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

const Gradient = () => (
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
