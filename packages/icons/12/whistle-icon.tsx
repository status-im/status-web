import { useTheme } from '@tamagui/core'
import { Circle, Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgWhistleIcon = (props: IconProps) => {
  const { color: token = '$neutral-100' } = props
  const theme = useTheme()
  /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const color = theme[token]?.val ?? token
  return (
    <Svg
      width={12}
      height={12}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M7.128 7.696A3 3 0 0 0 6.732 6l1.232-1.866-1-1.732-4.33 2.5a3 3 0 1 0 4.494 2.794Z"
        stroke={color}
        strokeWidth={1.1}
      />
      <Circle
        r={1}
        transform="scale(-1 1) rotate(30 -16.062 -3.964)"
        stroke={color}
        strokeWidth={1.1}
      />
    </Svg>
  )
}
export default SvgWhistleIcon
