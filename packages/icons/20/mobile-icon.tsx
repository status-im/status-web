import { Path, Rect, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgMobileIcon = (props: SvgProps) => {
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
      <Rect
        x={4}
        y={3}
        width={12}
        height={14}
        rx={3}
        stroke={color}
        strokeWidth={1.3}
      />
      <Path d="M8.5 14.5h3" stroke={color} strokeWidth={1.3} />
    </Svg>
  )
}
export default SvgMobileIcon
