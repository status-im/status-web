import { useTheme } from '@tamagui/core'
import { Path, Rect, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgToggleIcon = (props: IconProps) => {
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
        x={2}
        y={5}
        width={16}
        height={10}
        rx={5}
        stroke={color}
        strokeWidth={1.3}
      />
      <Path
        d="M8 10a5 5 0 0 1 10 0 5 5 0 0 1-10 0Z"
        stroke={color}
        strokeWidth={1.3}
      />
    </Svg>
  )
}
export default SvgToggleIcon
