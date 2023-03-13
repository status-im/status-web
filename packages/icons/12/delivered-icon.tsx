import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgDeliveredIcon = (props: IconProps) => {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="m5.653 7.145 2.85-3.483-1.006-.824-4.045 4.945L1.46 5.79l-.92.92 2.5 2.5.508.507.455-.555.826-1.01 1.243 1.087.506.443.425-.52 4.5-5.5-1.006-.824-4.075 4.98-.769-.673Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgDeliveredIcon
