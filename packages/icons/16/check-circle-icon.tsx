import { Circle, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgCheckCircleIcon = (props: SvgProps) => {
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
      <Circle cx={8} cy={8} r={6} stroke={color} strokeWidth={1.2} />
      <Path d="m5 8 2 2 4-4" stroke={color} strokeWidth={1.2} />
    </Svg>
  )
}
export default SvgCheckCircleIcon
