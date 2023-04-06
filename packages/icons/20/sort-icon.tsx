import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgSortIcon = (props: IconProps) => {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.85 14.43V3.5h1.3v10.93l1.89-1.89.92.92-3 3-.46.46-.46-.46-3-3 .92-.92 1.89 1.89ZM7.15 5.57l1.89 1.89.92-.92-3-3-.46-.46-.46.46-3 3 .92.92 1.89-1.89V16.5h1.3V5.57Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgSortIcon
