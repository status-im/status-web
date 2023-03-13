import { useTheme } from '@tamagui/core'
import { Path, Rect, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgPasswordIcon = (props: IconProps) => {
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
        x={3.5}
        y={3.5}
        width={13}
        height={13}
        rx={4}
        stroke={color}
        strokeWidth={1.3}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.5 9.15a.85.85 0 1 0 0 1.7.85.85 0 0 0 0-1.7ZM5.35 10a2.15 2.15 0 0 1 4.2-.65H14.15V12h-1.3v-1.35h-.7v.85h-1.3v-.85h-1.3a2.15 2.15 0 0 1-4.2-.65Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgPasswordIcon
