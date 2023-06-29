import { customisation, neutral, white } from '@status-im/colors'
import { Button, Tag, Text } from '@status-im/components'
import { DownloadIcon } from '@status-im/icons'

import { AppLayout, Content } from '@/layouts/app-layout'
import { rgbToHex } from '@/utils/rgb-to-hex'

import type { GetStaticProps, Page } from 'next'

export const getStaticProps: GetStaticProps<Props> = async () => {
  const transformColor = (name: string, rgba: string, invert = false) => {
    const [r, g, b] = rgba.match(/\d+/g)!.map(Number)
    return {
      name,
      rgb: { r, g, b },
      hex: rgbToHex({ r, g, b }),
      invert,
    }
  }

  return {
    props: {
      colors: {
        main: [
          transformColor('Dark', neutral['100']),
          transformColor('White', white['100'], true),
          transformColor('Blue', customisation['blue-50']),
        ],
        custom: [
          transformColor('Purple', customisation['purple-50']),
          transformColor('Orange', customisation['orange-50']),
          transformColor('Army', customisation['army-50']),
          transformColor('Turquoise', customisation['turquoise-50']),
          transformColor('Sky', customisation['sky-50']),
          transformColor('Yellow', customisation['yellow-50']),
          transformColor('Pink', customisation['pink-50']),
          transformColor('Cooper', customisation['cooper-50']),
          transformColor('Camel', customisation['camel-50']),
          transformColor('Magenta', customisation['magenta-50']),
        ],
      },
    },
  }
}

type Props = {
  colors: {
    main: Color[]
    custom: Color[]
  }
}

const BrandPage: Page<Props> = props => {
  const { colors } = props

  return (
    <Content>
      <div className="container flex flex-col items-start pb-12 pt-16 lg:pb-30 lg:pt-40">
        <div className="mb-4">
          <Tag size={32} label="Brand" />
        </div>
        <h1 className="mb-6 text-48 lg:mb-8 lg:text-88">
          Get Status
          <br />
          brand assets
        </h1>
        <div className="flex w-full flex-col gap-3 rounded-2xl border border-dashed border-neutral-80/20 p-2 pl-3 sm:max-w-[462px] sm:flex-row sm:items-center sm:gap-10">
          <Text size={13}>
            This ZIP file contains Status logos, partnership badges, and product
            assets.
          </Text>

          <Button icon={<DownloadIcon size={20} />}>Download</Button>
        </div>
      </div>

      <div className="border-b border-dashed border-neutral-80/20 pb-12 lg:pb-20">
        <LogoSection
          title="Our logo"
          description="With typo in multiple versions"
          logos={[1, 2, 3, 4]}
        />
        <LogoSection
          title="Mark only"
          description="Without typo in multiple versions"
          logos={[1, 2, 3, 4]}
        />
        <LogoSection
          title="Other variants"
          description="With and without typo"
          logos={[1, 2, 3, 4]}
        />
      </div>

      <div className="border-b border-dashed border-neutral-80/20 py-12 lg:py-20">
        <ColorSection
          title="Main colors"
          description="Our main colors palette"
          colors={colors.main}
        />
        <ColorSection
          title="Custom colors"
          description="Our accent colors"
          colors={colors.custom}
        />
      </div>

      <div className="border-b border-dashed border-neutral-80/20 py-12 lg:py-20">
        <AssetSection
          title="Product assets"
          description="Screenshots of our product"
          assets={[]}
        />
      </div>

      <div className="container py-24 lg:py-40">
        <div className="mx-auto flex max-w-[600px] flex-col items-center">
          <h3 className="mb-4 text-center text-40 lg:text-64">
            Download assets
          </h3>
          <div className="mb-8 text-center">
            <Text size={27}>
              ZIP file contains Status logos, partnership badges, and product
              assets.
            </Text>
          </div>
          <Button icon={<DownloadIcon size={20} />}>Download</Button>
        </div>
      </div>
    </Content>
  )
}

type BrandSectionProps = {
  title: string
  description: string
  children: React.ReactNode
}

const BrandSection = (props: BrandSectionProps) => {
  const { title, description, children } = props

  return (
    <section className="container py-12 lg:py-20">
      <div className="flex flex-col gap-5 pb-12 md:flex-row md:items-center md:justify-between md:gap-0 md:pb-10">
        <div className="grid">
          <h2 className="text-27 font-semibold">{title}</h2>
          <Text size={27} weight="regular">
            {description}
          </Text>
        </div>

        <Button variant="outline" icon={<DownloadIcon size={20} />}>
          Download
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {children}
      </div>
    </section>
  )
}

const LogoSection = (
  props: Omit<BrandSectionProps, 'children'> & { logos: number[] }
) => {
  const { logos, ...sectionProps } = props

  return (
    <BrandSection {...sectionProps}>
      {logos.map((logo, index) => (
        <div
          key={index}
          className="rounded-[20px] border border-neutral-80/5 bg-white-100 py-8"
        >
          LOGO HERE {logo}
        </div>
      ))}
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
  props: Omit<BrandSectionProps, 'children'> & { colors: Color[] }
) => {
  const { colors, ...sectionProps } = props

  return (
    <BrandSection {...sectionProps}>
      {colors.map(({ hex, rgb, name, invert }) => {
        const textColor = invert ? '$neutral-100' : '$white-100'

        return (
          <div
            key={name}
            style={{ background: hex }}
            className="flex flex-col gap-12 rounded-[20px] border border-neutral-80/5 bg-white-100 p-5"
          >
            <Text size={19} weight="semibold" color={textColor}>
              {name}
            </Text>
            <div className="flex flex-col uppercase">
              <Text size={15} color={textColor}>
                {hex}
              </Text>
              <Text size={15} color={textColor}>
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
  props: Omit<BrandSectionProps, 'children'> & { assets: number[] }
) => {
  const { assets, ...sectionProps } = props

  return (
    <BrandSection {...sectionProps}>
      {assets.map((asset, index) => (
        <div key={index} className="border border-neutral-80/5 bg-white-100">
          ASSET HERE {asset}
        </div>
      ))}
    </BrandSection>
  )
}

BrandPage.getLayout = page => <AppLayout hasPreFooter={false}>{page}</AppLayout>

export default BrandPage
