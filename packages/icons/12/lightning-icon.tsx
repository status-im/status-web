import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgLightningIcon = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
  return (
    <Svg
      width={12}
      height={14}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <Path
        d="M7 1.5V6h2.5L5 12.5v-5H2.5l4.5-6Z"
        stroke={color}
        strokeWidth={1.1}
        strokeLinejoin="round"
      />
    </Svg>
  )
}
export default SvgLightningIcon
