import { Rect, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgPauseIcon = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
  return (
    <Svg
      width={20}
      height={20}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect x={4} y={4} width={4} height={12} rx={1.5} fill={color} />
      <Rect x={12} y={4} width={4} height={12} rx={1.5} fill={color} />
    </Svg>
  )
}
export default SvgPauseIcon
