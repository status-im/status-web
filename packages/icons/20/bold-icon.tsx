import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgBoldIcon = (props: IconProps) => {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.25 4.5A.75.75 0 0 1 6 3.75h4.5a3.25 3.25 0 0 1 2.355 5.49A3.75 3.75 0 0 1 11 16.25H6a.75.75 0 0 1-.75-.75v-11Zm1.5 4.25h3.75a1.75 1.75 0 1 0 0-3.5H6.75v3.5Zm0 1.5v4.5H11a2.25 2.25 0 0 0 0-4.5H6.75Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgBoldIcon