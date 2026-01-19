import { neutral, white } from '@status-im/colors'
import { BrandSection, BrandSectionProps } from './brand-section'
import { CopyHexButton } from './copy-hex-button'

type Color = {
  name: string
  rgb: { r: number; g: number; b: number }
  hex: string
  invert: boolean
}

const ColorSection = (
  props: Omit<BrandSectionProps, 'children' | 'fileName'> & {
    colors: Color[]
  },
) => {
  const { colors, ...sectionProps } = props

  return (
    <BrandSection {...sectionProps}>
      {colors.map(({ hex, rgb, name, invert }) => {
        const textColor = invert ? neutral['100'] : white['100']
        const textToRgbColor = invert ? neutral['50'] : white['60']

        return (
          <div
            key={name}
            style={{ background: hex, color: textColor }}
            className="group relative flex flex-col gap-12 rounded-20 border border-neutral-80/5 bg-white-100 p-5 shadow-1 transition-all hover:shadow-2"
          >
            <div className="absolute right-3 top-3 transition-opacity group-hover:opacity-[100%] lg:opacity-[0%]">
              <CopyHexButton hex={hex} invert={invert} />
            </div>
            <p className="text-19 font-500">{name}</p>
            <div className="flex flex-col uppercase">
              <p className="text-15 font-500">{hex}</p>
              <p
                className="text-15 font-500"
                style={{
                  color: textToRgbColor,
                }}
              >
                RGB {[rgb.r, rgb.g, rgb.b].join(',')}
              </p>
            </div>
          </div>
        )
      })}
    </BrandSection>
  )
}

export { ColorSection }
