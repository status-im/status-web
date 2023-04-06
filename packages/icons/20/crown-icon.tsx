import { useTheme } from '@tamagui/core'
import { Circle, Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgCrownIcon = (props: IconProps) => {
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
        d="m11 4 1.007 2.014c.335.67.503 1.006.753 1.156a1 1 0 0 0 .73.118c.285-.063.55-.328 1.08-.858L16 5M9 4 7.993 6.014c-.335.67-.503 1.006-.753 1.156a1 1 0 0 1-.73.118c-.285-.063-.55-.328-1.08-.858L4 5m-1.625.625L2.5 6.5 3 10l.215 1.505c.278 1.948.418 2.923.888 3.655a4 4 0 0 0 1.704 1.478C6.598 17 7.583 17 9.55 17h.898c1.969 0 2.953 0 3.745-.362a4 4 0 0 0 1.703-1.478c.47-.732.61-1.707.888-3.655L17 10l.5-3.5.125-.875"
        stroke={color}
        strokeWidth={1.3}
      />
      <Path
        d="M3.5 13S5 14 10 14s6.5-1 6.5-1"
        stroke={color}
        strokeWidth={1.3}
      />
      <Circle cx={10} cy={3.5} r={1.5} stroke={color} strokeWidth={1.3} />
      <Circle cx={3} cy={4.5} r={1.5} stroke={color} strokeWidth={1.3} />
      <Circle cx={17} cy={4.5} r={1.5} stroke={color} strokeWidth={1.3} />
    </Svg>
  )
}
export default SvgCrownIcon
