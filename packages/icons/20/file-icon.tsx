import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgFileIcon = (props: IconProps) => {
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
      <Path
        d="M11 3c.64 0 1.254.254 1.707.707l2.586 2.586C15.746 6.746 16 7.36 16 8v4.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C13.72 17 12.88 17 11.2 17H8.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C4 14.72 4 13.88 4 12.2V7.8c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.311-1.311C6.28 3 7.12 3 8.8 3H11Z"
        stroke={color}
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
      <Path
        d="M16 7h-3.4c-.56 0-.84 0-1.054-.109a1 1 0 0 1-.437-.437C11 6.24 11 5.96 11 5.4V3"
        stroke={color}
        strokeWidth={1.3}
      />
      <Path
        d="M7 9.5h4M7 12.5h6"
        stroke={color}
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
    </Svg>
  )
}
export default SvgFileIcon
