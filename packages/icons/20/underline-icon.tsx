import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgUnderlineIcon = (props: IconProps) => {
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
        d="M13.5 4.5V9a3.5 3.5 0 0 1-3.5 3.5v0A3.5 3.5 0 0 1 6.5 9V4.5"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13 15.5H7"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
export default SvgUnderlineIcon
