import { useTheme } from '@tamagui/core'
import { Rect, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgPauseIcon = (props: IconProps) => {
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
      <Rect x={4} y={4} width={4} height={12} rx={1.5} fill={color} />
      <Rect x={12} y={4} width={4} height={12} rx={1.5} fill={color} />
    </Svg>
  )
}
export default SvgPauseIcon
