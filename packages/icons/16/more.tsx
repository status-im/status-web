import { Circle, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgMore = (props: SvgProps) => {
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
      <Circle cx={3.25} cy={8} r={1.25} fill={color} />
      <Circle cx={8} cy={8} r={1.25} fill={color} />
      <Circle cx={12.75} cy={8} r={1.25} fill={color} />
    </Svg>
  )
}
export default SvgMore
