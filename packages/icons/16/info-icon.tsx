import { Circle, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgInfoIcon = (props: SvgProps) => {
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
      <Path d="M8 7v4M8 5v1.25" stroke={color} strokeWidth={1.2} />
    </Svg>
  )
}
export default SvgInfoIcon
