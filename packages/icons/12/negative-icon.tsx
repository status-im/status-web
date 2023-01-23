import { Circle, ClipPath, Defs, G, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgNegativeIcon = (props: SvgProps) => {
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
      <G clipPath="url(#negative-icon_svg__a)" stroke="#E65F5C">
        <Circle cx={6} cy={6} r={5.5} strokeOpacity={0.4} />
        <Path d="M6 8.5V3M3 5.5l3 3 3-3" strokeWidth={1.2} />
      </G>
      <Defs>
        <ClipPath id="negative-icon_svg__a">
          <Path fill="#fff" d="M0 0h12v12H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}
export default SvgNegativeIcon
