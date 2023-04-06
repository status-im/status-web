import { useTheme } from '@tamagui/core'
import { Circle, Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgAlertIcon = (props: IconProps) => {
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
      <Circle
        cx={8}
        cy={8}
        r={6}
        transform="rotate(-180 8 8)"
        stroke={color}
        strokeWidth={1.2}
      />
      <Path d="M8 9V5" stroke={color} strokeWidth={1.3} />
      <Path d="M8 11V9.75" stroke={color} strokeWidth={1.2} />
    </Svg>
  )
}
export default SvgAlertIcon
