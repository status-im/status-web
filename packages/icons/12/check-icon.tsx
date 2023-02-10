import { Circle, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgCheckIcon = (props: SvgProps) => {
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
      <Circle cx={6} cy={6} r={4.45} stroke={color} strokeWidth={1.1} />
      <Path d="m4 6.3 1.333 1.2L8 4.5" stroke={color} strokeWidth={1.1} />
    </Svg>
  )
}
export default SvgCheckIcon
