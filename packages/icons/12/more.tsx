import { Circle, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgMore = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
  return (
    <Svg
      width={12}
      height={12}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Circle cx={2.5} cy={6} r={1} fill={color} />
      <Circle cx={6} cy={6} r={1} fill={color} />
      <Circle cx={9.5} cy={6} r={1} fill={color} />
    </Svg>
  )
}
export default SvgMore
