import { Circle, ClipPath, Defs, G, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgAddReactionIcon = (props: SvgProps) => {
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
      <G clipPath="url(#add-reaction-icon_svg__a)">
        <Path d="M7.294 1.17A5 5 0 1 0 11 6" stroke={color} strokeWidth={1.1} />
        <Path d="M4.068 7a2 2 0 0 0 3.864 0" stroke={color} strokeWidth={1.1} />
        <Circle cx={4.75} cy={4.75} r={0.75} fill={color} />
        <Circle cx={7.25} cy={4.75} r={0.75} fill={color} />
        <Path d="M8 2.5h4M10 .5v4" stroke={color} strokeWidth={1.1} />
      </G>
      <Defs>
        <ClipPath id="add-reaction-icon_svg__a">
          <Path fill="#fff" d="M0 0h12v12H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}
export default SvgAddReactionIcon
