import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgSwapIcon = (props: IconProps) => {
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
        d="M14.43 7.15H3.5v-1.3h10.93l-1.89-1.89.92-.92 3 3 .46.46-.46.46-3 3-.92-.92 1.89-1.89Z"
        fill={color}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="m5.57 12.85 1.89-1.89-.92-.92-3 3-.46.46.46.46 3 3 .92-.92-1.89-1.89H16.5v-1.3H5.57Z"
        fill="#1B273D"
        fillOpacity={0.3}
      />
    </Svg>
  )
}
export default SvgSwapIcon
