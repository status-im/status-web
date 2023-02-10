import { Circle, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgProgressIcon = (props: SvgProps) => {
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
      <Circle
        cx={8}
        cy={8}
        r={6}
        transform="rotate(-180 8 8)"
        stroke="#F0F2F5"
        strokeWidth={1.2}
      />
      <Path d="M8 2a6 6 0 0 1 5.706 4.146" stroke={color} strokeWidth={1.2} />
    </Svg>
  )
}
export default SvgProgressIcon
