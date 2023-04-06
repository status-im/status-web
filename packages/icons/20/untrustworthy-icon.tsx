import { useTheme } from '@tamagui/core'
import { Circle, Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgUntrustworthyIcon = (props: IconProps) => {
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
      <Circle
        cx={10}
        cy={10}
        r={6.75}
        fill="#E65F5C"
        stroke="#E65F5C"
        strokeWidth={1.3}
      />
      <Path d="M10 12V6M10 14v-1" stroke="#fff" strokeWidth={1.3} />
    </Svg>
  )
}
export default SvgUntrustworthyIcon
