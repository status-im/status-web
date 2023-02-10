import { Path, Rect, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgAccountNumberIcon = (props: SvgProps) => {
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
      <Rect x={2.5} y={2.5} width={15} height={15} rx={3.5} stroke={color} />
      <Path
        d="M11.322 6v8H9.873V7.41h-.047l-1.87 1.195V7.277L9.942 6h1.38Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgAccountNumberIcon
