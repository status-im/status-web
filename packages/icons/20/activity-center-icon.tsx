import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgActivityCenterIcon = (props: IconProps) => {
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
        d="M5.5 7.5a4.5 4.5 0 1 1 9 0v.75c0 .811.263 1.6.75 2.25l.45.6a1.5 1.5 0 0 1-1.2 2.4h-9a1.5 1.5 0 0 1-1.2-2.4l.45-.6a3.75 3.75 0 0 0 .75-2.25V7.5ZM7.878 16.121a2.999 2.999 0 0 0 4.243 0"
        stroke={color}
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
    </Svg>
  )
}
export default SvgActivityCenterIcon
