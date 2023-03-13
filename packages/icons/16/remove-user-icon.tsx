import { useTheme } from '@tamagui/core'
import { Circle, Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgRemoveUserIcon = (props: IconProps) => {
  const { color: token = '$neutral-100' } = props
  const theme = useTheme()
  /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const color = theme[token]?.val ?? token
  return (
    <Svg
      width={16}
      height={16}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M8.5 10H6a3 3 0 0 0-3 3 1 1 0 0 0 1 1h4.5"
        stroke={color}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
      <Circle
        cx={8.5}
        cy={5}
        r={2.5}
        stroke={color}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
      <Path d="M9.5 12h4" stroke={color} strokeWidth={1.2} />
    </Svg>
  )
}
export default SvgRemoveUserIcon
