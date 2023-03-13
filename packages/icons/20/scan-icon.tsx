import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgScanIcon = (props: IconProps) => {
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
        d="M8.143 3.5c-1.532 0-2.298 0-2.894.273A3 3 0 0 0 3.773 5.25C3.5 5.845 3.5 6.611 3.5 8.143M11.857 3.5c1.532 0 2.298 0 2.894.273a3 3 0 0 1 1.476 1.476c.273.596.273 1.362.273 2.894m0 3.714c0 1.532 0 2.298-.273 2.894a3 3 0 0 1-1.476 1.476c-.596.273-1.362.273-2.894.273m-3.714 0c-1.532 0-2.298 0-2.894-.273a3 3 0 0 1-1.476-1.476c-.273-.596-.273-1.362-.273-2.894M6 10h8"
        stroke={color}
        strokeWidth={1.3}
      />
    </Svg>
  )
}
export default SvgScanIcon
