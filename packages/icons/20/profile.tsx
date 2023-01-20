import { Circle, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgProfile = (props: SvgProps) => {
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
      <Circle cx={10} cy={10} r={6.75} stroke={color} strokeWidth={1.3} />
      <Path
        d="M6 15.5a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3"
        stroke={color}
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
      <Circle
        cx={10}
        cy={8}
        r={2}
        stroke={color}
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
    </Svg>
  )
}
export default SvgProfile
