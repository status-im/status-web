import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgJumpToIcon = (props: IconProps) => {
  const { color: token = '$neutral-100' } = props
  const theme = useTheme()
  /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const color = theme[token]?.val ?? token
  return (
    <Svg
      width={12}
      height={12}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path d="M4.575 2.525h4.95v4.95" stroke={color} strokeWidth={1.1} />
      <Path
        d="M9.5 3A7.578 7.578 0 0 0 5 9.924V10"
        stroke={color}
        strokeWidth={1.1}
      />
    </Svg>
  )
}
export default SvgJumpToIcon
