import { useTheme } from '@tamagui/core'
import { Rect, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgListViewIcon = (props: IconProps) => {
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
      <Rect
        x={3}
        y={4}
        width={14}
        height={4.5}
        rx={1.5}
        stroke={color}
        strokeWidth={1.3}
      />
      <Rect
        x={3}
        y={11.5}
        width={14}
        height={4.5}
        rx={1.5}
        stroke={color}
        strokeWidth={1.3}
      />
    </Svg>
  )
}
export default SvgListViewIcon
