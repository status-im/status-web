import { useTheme } from '@tamagui/core'
import { Path, Rect, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgMobileIcon = (props: IconProps) => {
  const { color: token = '$neutral-100' } = props
  const theme = useTheme()
  /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const color = theme[token]?.val ?? token
  return (
    <Svg
      width={20}
      height={20}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect
        x={4}
        y={3}
        width={12}
        height={14}
        rx={3}
        stroke={color}
        strokeWidth={1.3}
      />
      <Path d="M8.5 14.5h3" stroke={color} strokeWidth={1.3} />
    </Svg>
  )
}
export default SvgMobileIcon
