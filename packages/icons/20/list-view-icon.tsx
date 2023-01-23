import { Rect, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgListViewIcon = (props: SvgProps) => {
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
      <Rect
        x={3}
        y={4}
        width={14}
        height={4.5}
        rx={1.5}
        stroke={color}
        strokeWidth={1.3}
      />
      <Rect
        x={3}
        y={11.5}
        width={14}
        height={4.5}
        rx={1.5}
        stroke={color}
        strokeWidth={1.3}
      />
    </Svg>
  )
}
export default SvgListViewIcon
