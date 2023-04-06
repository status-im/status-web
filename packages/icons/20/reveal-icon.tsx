import { useTheme } from '@tamagui/core'
import { Circle, Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgRevealIcon = (props: IconProps) => {
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
        d="M10 4c4.5 0 7 5 7 6s-2.5 6-7 6-7-5-7-6 2.5-6 7-6Z"
        stroke={color}
        strokeWidth={1.3}
      />
      <Circle cx={10} cy={10} r={2.5} stroke={color} strokeWidth={1.3} />
    </Svg>
  )
}
export default SvgRevealIcon
