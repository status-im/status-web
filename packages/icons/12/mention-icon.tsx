import { Circle, ClipPath, Defs, G, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgMentionIcon = (props: SvgProps) => {
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
      <G clipPath="url(#mention-icon_svg__a)" stroke={color} strokeWidth={1.1}>
        <Path d="M11 6a5 5 0 1 0-2.5 4.33" />
        <Circle cx={6} cy={6} r={2} />
        <Path d="M8 3.5v3.456C8 7.809 8.691 8.5 9.544 8.5c.709 0 1.326-.485 1.391-1.19C11 6.609 11 6 11 6" />
      </G>
      <Defs>
        <ClipPath id="mention-icon_svg__a">
          <Path fill="#fff" d="M0 0h12v12H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}
export default SvgMentionIcon
