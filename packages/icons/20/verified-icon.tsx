import { useTheme } from '@tamagui/core'
import { Circle, Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgVerifiedIcon = (props: IconProps) => {
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
        cx={10.25}
        cy={10.25}
        r={6.75}
        fill="#26A69A"
        stroke="#26A69A"
        strokeWidth={1.3}
      />
      <Path d="M6.833 10.5 9 12.5l4.333-5" stroke="#fff" strokeWidth={1.3} />
    </Svg>
  )
}
export default SvgVerifiedIcon