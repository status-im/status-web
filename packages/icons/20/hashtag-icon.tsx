import { useTheme } from '@tamagui/core'
import { Path, Rect, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgHashtagIcon = (props: IconProps) => {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.1 11.9V13h1.3v-1.1h1.2V13h1.3v-1.1H13v-1.3h-1.1V9.4H13V8.1h-1.1V7h-1.3v1.1H9.4V7H8.1v1.1H7v1.3h1.1v1.2H7v1.3h1.1Zm1.3-1.3h1.2V9.4H9.4v1.2Z"
        fill={color}
      />
      <Rect
        x={3.5}
        y={3.5}
        width={13}
        height={13}
        rx={4}
        stroke={color}
        strokeWidth={1.3}
      />
    </Svg>
  )
}
export default SvgHashtagIcon
