import { Circle, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgAlertIcon = (props: SvgProps) => {
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
      <Circle cx={6} cy={6} r={4.45} stroke={color} strokeWidth={1.1} />
      <Path d="M6 6.5v-3M6 8.5v-1" stroke={color} strokeWidth={1.1} />
    </Svg>
  )
}
export default SvgAlertIcon
