import { Circle, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgReactionIcon = (props: SvgProps) => {
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
      <Path
        d="M7.525 12a3.5 3.5 0 0 0 4.95 0"
        stroke={color}
        strokeWidth={1.3}
      />
      <Circle cx={8} cy={8.5} r={1} fill={color} />
      <Circle cx={12} cy={8.5} r={1} fill={color} />
    </Svg>
  )
}
export default SvgReactionIcon
