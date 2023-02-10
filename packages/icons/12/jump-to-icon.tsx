import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgJumpToIcon = (props: SvgProps) => {
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
      <Path d="M4.575 2.525h4.95v4.95" stroke={color} strokeWidth={1.1} />
      <Path
        d="M9.5 3A7.578 7.578 0 0 0 5 9.924V10"
        stroke={color}
        strokeWidth={1.1}
      />
    </Svg>
  )
}
export default SvgJumpToIcon
