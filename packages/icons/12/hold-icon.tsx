import { Circle, ClipPath, Defs, G, Path, Rect, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgHoldIcon = (props: SvgProps) => {
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
      <G clipPath="url(#hold-icon_svg__a)">
        <Circle cx={6} cy={6} r={6} fill="#647084" />
        <Path d="M3.333 6.4 5.111 8l3.556-4" stroke="#fff" strokeWidth={1.1} />
      </G>
      <Defs>
        <ClipPath id="hold-icon_svg__a">
          <Rect width={12} height={12} rx={6} fill="#fff" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}
export default SvgHoldIcon
