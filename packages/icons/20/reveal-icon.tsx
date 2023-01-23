import { Circle, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgRevealIcon = (props: SvgProps) => {
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
      <Path
        d="M10 4c4.5 0 7 5 7 6s-2.5 6-7 6-7-5-7-6 2.5-6 7-6Z"
        stroke={color}
        strokeWidth={1.3}
      />
      <Circle cx={10} cy={10} r={2.5} stroke={color} strokeWidth={1.3} />
    </Svg>
  )
}
export default SvgRevealIcon
