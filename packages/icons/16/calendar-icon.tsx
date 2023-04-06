import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgCalendarIcon = (props: IconProps) => {
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
        d="M14 9.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C11.72 14 10.88 14 9.2 14H6.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C2 11.72 2 10.88 2 9.2V7.8c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.311-1.311C4.28 3 5.12 3 6.8 3h2.4c1.68 0 2.52 0 3.162.327a3 3 0 0 1 1.311 1.311C14 5.28 14 6.12 14 7.8v1.4Z"
        stroke={color}
        strokeWidth={1.2}
      />
      <Path d="M5 2v2" stroke="#000" strokeWidth={1.3} strokeLinecap="round" />
      <Path
        d="M3 6.5h10"
        stroke="#000"
        strokeWidth={1.3}
        strokeLinecap="square"
      />
      <Path d="M11 2v2" stroke="#000" strokeWidth={1.3} strokeLinecap="round" />
    </Svg>
  )
}
export default SvgCalendarIcon
