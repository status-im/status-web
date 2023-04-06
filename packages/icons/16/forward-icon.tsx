import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgForwardIcon = (props: IconProps) => {
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
        d="M14 8H8.4c-2.24 0-3.36 0-4.216.436a4 4 0 0 0-1.748 1.748C2 11.04 2 12.16 2 14.4v.1"
        stroke="#000"
        strokeWidth={1.2}
      />
      <Path d="M10 11.5 14 8l-4-3.5" stroke="#000" strokeWidth={1.2} />
    </Svg>
  )
}
export default SvgForwardIcon
