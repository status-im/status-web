import { Circle, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgVerifiedIcon = (props: SvgProps) => {
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
      <Circle
        cx={10.25}
        cy={10.25}
        r={6.75}
        fill="#26A69A"
        stroke="#26A69A"
        strokeWidth={1.3}
      />
      <Path d="M6.833 10.5 9 12.5l4.333-5" stroke="#fff" strokeWidth={1.3} />
    </Svg>
  )
}
export default SvgVerifiedIcon
