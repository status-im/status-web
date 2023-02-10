import { Circle, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgInfoIcon = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
  return (
    <Svg
      width={20}
      height={20}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <Circle cx={10} cy={10} r={6.75} stroke={color} strokeWidth={1.3} />
      <Path d="M10 9.5V14" stroke={color} strokeWidth={1.3} />
      <Circle cx={10} cy={7} r={1} transform="rotate(-180 10 7)" fill={color} />
    </Svg>
  )
}
export default SvgInfoIcon
