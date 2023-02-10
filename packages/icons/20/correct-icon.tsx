import { Circle, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgCorrectIcon = (props: SvgProps) => {
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
      <Circle
        cx={10}
        cy={10}
        r={6.75}
        stroke={color}
        strokeOpacity={0.4}
        strokeWidth={1.3}
      />
      <Path d="M6.833 10.5 9 12.5l4.333-5" stroke={color} strokeWidth={1.3} />
    </Svg>
  )
}
export default SvgCorrectIcon
