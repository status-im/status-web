import { Circle, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgTotalMembersIcon = (props: SvgProps) => {
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
      <Path
        d="M3 9.25A2.25 2.25 0 0 1 5.25 7h1.5A2.25 2.25 0 0 1 9 9.25a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 3 9.25Z"
        stroke={color}
        strokeWidth={1.1}
        strokeLinejoin="round"
      />
      <Circle
        cx={6}
        cy={3.5}
        r={1.5}
        stroke={color}
        strokeWidth={1.1}
        strokeLinejoin="round"
      />
    </Svg>
  )
}
export default SvgTotalMembersIcon
