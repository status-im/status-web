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
      width={12}
      height={12}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect x={2} y={2} width={8} height={8} rx={2} fill={color} />
    </Svg>
  )
}
export default SvgPauseIcon
