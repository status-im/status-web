import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgSpeedIcon = (props: IconProps) => {
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
        d="m6.5 13.5-1.45 1.45a7 7 0 1 1 9.9 0L13.5 13.5"
        stroke={color}
        strokeWidth={1.3}
      />
      <Path
        d="M10 3v2M3 10h2M15 10h2M5 5l1.414 1.414M15.121 5l-1.414 1.414M10.22 12h-.44a1 1 0 0 1-.97-1.242l.705-2.818c.126-.505.844-.505.97 0l.704 2.817A1 1 0 0 1 10.22 12Z"
        stroke="#000"
        strokeWidth={1.3}
      />
    </Svg>
  )
}
export default SvgSpeedIcon
