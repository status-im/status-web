import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgConnectionIcon = (props: IconProps) => {
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
        d="M11 14H5l3-7 3 7Z"
        stroke="#000"
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
      <Path
        d="M8 7V5M4.61 2a3.6 3.6 0 0 0 0 6M5.8 3.531a2.1 2.1 0 0 0 0 2.939M11.39 8a3.601 3.601 0 0 0 0-6M10.2 6.469a2.1 2.1 0 0 0 0-2.939"
        stroke="#000"
        strokeWidth={1.2}
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
export default SvgConnectionIcon
