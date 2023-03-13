import { useTheme } from '@tamagui/core'
import { Circle, Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgSadIcon = (props: IconProps) => {
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
      <Circle cx={10} cy={10} r={6.75} stroke={color} strokeWidth={1.3} />
      <Path
        d="M7.525 13.025a3.5 3.5 0 0 1 4.95 0"
        stroke={color}
        strokeWidth={1.3}
      />
      <Circle cx={8} cy={8.5} r={1} fill={color} />
      <Circle cx={12} cy={8.5} r={1} fill={color} />
    </Svg>
  )
}
export default SvgSadIcon
