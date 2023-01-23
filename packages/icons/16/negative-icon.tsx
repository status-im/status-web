import { Circle, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgNegativeIcon = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
  return (
    <Svg
      width={16}
      height={16}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Circle cx={8} cy={8} r={6} stroke="#E65F5C" strokeOpacity={0.4} />
      <Path d="M8 10.5V5M5 7.5l3 3 3-3" stroke="#E65F5C" strokeWidth={1.2} />
    </Svg>
  )
}
export default SvgNegativeIcon
