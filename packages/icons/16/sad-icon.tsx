import { Circle, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgSadIcon = (props: SvgProps) => {
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
      <Path
        d="M10.5 10.75a3.547 3.547 0 0 0-1.147-.74 3.645 3.645 0 0 0-2.706 0 3.547 3.547 0 0 0-1.147.74"
        stroke={color}
        strokeWidth={1.2}
      />
      <Circle cx={6} cy={6.5} r={1} fill={color} />
      <Circle cx={10} cy={6.5} r={1} fill={color} />
    </Svg>
  )
}
export default SvgSadIcon
