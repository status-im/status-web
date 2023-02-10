import { Circle, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgFriendIcon = (props: SvgProps) => {
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
      <Path
        d="M5 14.75A3.75 3.75 0 0 1 8.75 11h2.5A3.75 3.75 0 0 1 15 14.75c0 .69-.56 1.25-1.25 1.25h-7.5C5.56 16 5 15.44 5 14.75Z"
        stroke={color}
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
      <Circle
        cx={10}
        cy={6}
        r={2.5}
        stroke={color}
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
    </Svg>
  )
}
export default SvgFriendIcon
