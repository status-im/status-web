import { Circle, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgWorld = (props: SvgProps) => {
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
      <Circle cx={10} cy={10} r={7} stroke={color} strokeWidth={1.3} />
      <Path
        d="m3 11 2.107-1.873A2.7 2.7 0 0 0 5 5M4.5 14c.667-.5 2.2-1.4 3-1 1 .5 1.5 1 1.5 1.5S7.5 16 6.5 16M12.5 3.5C11 4.333 8.2 5.6 9 6c1 .5 3.5.5 3.5 1.5s-2 .5-3 1c-.633.316-2 1-.5 1.5s2 1 2 2c0 .286.106.707.25 1.147.258.783 1.082.728 1.287-.07.25-.978.62-2.015 1.463-2.577 1.664-1.11-.5-3 2-4"
        stroke="#000"
        strokeWidth={1.3}
      />
    </Svg>
  )
}
export default SvgWorld
