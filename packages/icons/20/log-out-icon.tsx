import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgLogOutIcon = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
  return (
    <Svg
      width={20}
      height={20}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <Path
        d="M9.5 4H8.3c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3.5 6.28 3.5 7.12 3.5 8.8v2.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.78 16 6.62 16 8.3 16h1.2"
        stroke="#1B273D"
        strokeOpacity={0.3}
        strokeWidth={1.3}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="m15.43 9.35-2.89-2.89.92-.92 4 4 .46.46-.46.46-4 4-.92-.92 2.89-2.89H7v-1.3h8.43Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgLogOutIcon
