import { useTheme } from '@tamagui/core'
import { Path, Rect, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgKeyboardIcon = (props: IconProps) => {
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
        d="M3 8.8c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.311-1.311C5.28 4 6.12 4 7.8 4h4.4c1.68 0 2.52 0 3.162.327a3 3 0 0 1 1.311 1.311C17 6.28 17 7.12 17 8.8v2.4c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C14.72 16 13.88 16 12.2 16H7.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C3 13.72 3 12.88 3 11.2V8.8Z"
        stroke={color}
        strokeWidth={1.3}
      />
      <Rect x={5.25} y={6.25} width={2} height={2} rx={0.5} fill={color} />
      <Rect x={9} y={6.25} width={2} height={2} rx={0.5} fill={color} />
      <Rect x={12.75} y={6.25} width={2} height={2} rx={0.5} fill={color} />
      <Rect x={5.25} y={9.25} width={2} height={2} rx={0.5} fill={color} />
      <Rect x={9} y={9.25} width={2} height={2} rx={0.5} fill={color} />
      <Rect x={12.75} y={9.25} width={2} height={2} rx={0.5} fill={color} />
      <Rect x={6} y={12.5} width={8} height={1.5} rx={0.5} fill={color} />
    </Svg>
  )
}
export default SvgKeyboardIcon
