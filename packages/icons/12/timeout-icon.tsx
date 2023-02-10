import { ClipPath, Defs, G, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgTimeoutIcon = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
  return (
    <Svg
      width={12}
      height={12}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <G clipPath="url(#timeout-icon_svg__a)">
        <Path
          d="M10.5 6A4.5 4.5 0 1 1 6 1.5"
          stroke={color}
          strokeWidth={1.1}
        />
      </G>
      <Defs>
        <ClipPath id="timeout-icon_svg__a">
          <Path fill="#fff" d="M0 0h12v12H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}
export default SvgTimeoutIcon
