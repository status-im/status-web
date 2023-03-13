import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgEmailIcon = (props: IconProps) => {
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
      <Path d="m6 7 4 3 4-3" stroke={color} strokeWidth={1.3} />
      <Path
        d="M11 4H9c-1.864 0-2.796 0-3.53.304A4 4 0 0 0 3.303 6.47C3 7.204 3 8.136 3 10s0 2.796.304 3.53a4 4 0 0 0 2.165 2.165C6.204 16 7.136 16 9 16h2c1.864 0 2.796 0 3.53-.305a4 4 0 0 0 2.165-2.164C17 12.796 17 11.864 17 10s0-2.796-.305-3.53a4 4 0 0 0-2.164-2.166C13.796 4 12.864 4 11 4Z"
        stroke={color}
        strokeWidth={1.3}
      />
    </Svg>
  )
}
export default SvgEmailIcon
