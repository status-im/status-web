import { Circle, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgPositiveIcon = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
  return (
    <Svg
      width={16}
      height={16}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <Circle cx={8} cy={8} r={6} stroke={color} strokeOpacity={0.4} />
      <Path d="M8 5.5V11M11 8.5l-3-3-3 3" stroke={color} strokeWidth={1.2} />
    </Svg>
  )
}
export default SvgPositiveIcon
