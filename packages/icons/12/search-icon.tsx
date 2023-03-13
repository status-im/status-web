import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgSearchIcon = (props: IconProps) => {
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
        d="M2.1 5.382a3.282 3.282 0 1 1 6.565 0 3.282 3.282 0 0 1-6.565 0ZM5.382 1a4.382 4.382 0 1 0 2.686 7.846l2.153 2.152.778-.777-2.153-2.153A4.382 4.382 0 0 0 5.382 1Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgSearchIcon
