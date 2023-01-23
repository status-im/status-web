import { ClipPath, Defs, G, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgCardsIcon = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
  return (
    <Svg
      width={12}
      height={12}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G clipPath="url(#cards-icon_svg__a)" stroke={color} strokeWidth={1.1}>
        <Path d="M1 4.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C2.52 1 3.08 1 4.2 1h3.6c1.12 0 1.68 0 2.108.218a2 2 0 0 1 .874.874C11 2.52 11 3.08 11 4.2v3.6c0 1.12 0 1.68-.218 2.108a2 2 0 0 1-.874.874C9.48 11 8.92 11 7.8 11H4.2c-1.12 0-1.68 0-2.108-.218a2 2 0 0 1-.874-.874C1 9.48 1 8.92 1 7.8V4.2Z" />
        <Path d="M1 7.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C2.52 4 3.08 4 4.2 4h3.6c1.12 0 1.68 0 2.108.218a2 2 0 0 1 .874.874C11 5.52 11 6.08 11 7.2v.6c0 1.12 0 1.68-.218 2.108a2 2 0 0 1-.874.874C9.48 11 8.92 11 7.8 11H4.2c-1.12 0-1.68 0-2.108-.218a2 2 0 0 1-.874-.874C1 9.48 1 8.92 1 7.8v-.6Z" />
      </G>
      <Defs>
        <ClipPath id="cards-icon_svg__a">
          <Path fill="#fff" d="M0 0h12v12H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}
export default SvgCardsIcon
