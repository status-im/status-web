import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgQuarterIcon = (props: IconProps) => {
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
        d="M9.35 16.317v1.306a7.652 7.652 0 0 1-6.973-6.973h1.306a6.352 6.352 0 0 0 5.667 5.667ZM10.65 17.623a7.652 7.652 0 0 0 6.973-6.973h-1.306a6.352 6.352 0 0 1-5.667 5.667v1.306ZM10.65 3.683a6.352 6.352 0 0 1 5.667 5.667h1.306a7.652 7.652 0 0 0-6.973-6.973v1.306ZM9.35 2.377v1.306A6.352 6.352 0 0 0 3.683 9.35H2.377A7.652 7.652 0 0 1 9.35 2.377Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgQuarterIcon
