import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgBridgeIcon = (props: IconProps) => {
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
        d="M4 15.5v-11M7 12.5v-5M13 12.5v-5M10 12.5v-4M16 15.5v-11M17 12.5H3"
        stroke={color}
        strokeWidth={1.3}
        strokeLinecap="square"
        strokeLinejoin="round"
      />
      <Path
        d="m4 5.5.238.199a9 9 0 0 0 11.524 0L16 5.5M4 5.5l-1.5 1M16 5.5l1.5 1"
        stroke="#000"
        strokeWidth={1.3}
      />
    </Svg>
  )
}
export default SvgBridgeIcon
