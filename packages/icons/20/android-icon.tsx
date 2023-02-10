import { Circle, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgAndroidIcon = (props: SvgProps) => {
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
        d="M4 9a6 6 0 0 1 12 0v5.667A2.333 2.333 0 0 1 13.667 17H6.333A2.333 2.333 0 0 1 4 14.667V9Z"
        stroke={color}
        strokeWidth={1.3}
      />
      <Path
        d="M4 9a6 6 0 0 1 12 0H4ZM14 5l2-2M6 5 4 3"
        stroke={color}
        strokeWidth={1.3}
      />
      <Circle cx={8} cy={6.5} r={1} fill={color} />
      <Circle cx={12} cy={6.5} r={1} fill={color} />
    </Svg>
  )
}
export default SvgAndroidIcon
