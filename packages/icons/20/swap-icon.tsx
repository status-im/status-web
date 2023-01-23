import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgSwapIcon = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
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
