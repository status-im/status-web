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
      width={16}
      height={16}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Circle cx={8} cy={8} r={6} stroke={color} strokeWidth={1.2} />
      <Path
        d="M10.5 10.75a3.547 3.547 0 0 0-1.147-.74 3.645 3.645 0 0 0-2.706 0 3.547 3.547 0 0 0-1.147.74"
        stroke={color}
        strokeWidth={1.2}
      />
      <Circle cx={6} cy={6.5} r={1} fill={color} />
      <Circle cx={10} cy={6.5} r={1} fill={color} />
    </Svg>
  )
}
export default SvgSadIcon
