import { Circle, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgPending = (props: SvgProps) => {
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
      <Circle cx={3} cy={6} r={1} fill="#000" fillOpacity={0.4} />
      <Circle cx={6} cy={6} r={1} fill="#1B273D" fillOpacity={0.3} />
      <Circle cx={9} cy={6} r={1} fill="#000" fillOpacity={0.2} />
    </Svg>
  )
}
export default SvgPending
