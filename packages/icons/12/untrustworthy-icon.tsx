import { Circle, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgUntrustworthyIcon = (props: SvgProps) => {
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
      <Circle cx={6} cy={6} r={5} fill={color} />
      <Path d="M6 7V3M6 9V8" stroke="#fff" strokeWidth={1.1} />
    </Svg>
  )
}
export default SvgUntrustworthyIcon
