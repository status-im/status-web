import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgCloseIcon = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
  return (
    <Svg
      width={12}
      height={12}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <Path
        d="M2.5 9.5 6 6 2.5 2.5M9.5 9.5 6 6l3.5-3.5"
        stroke={color}
        strokeWidth={1.1}
      />
    </Svg>
  )
}
export default SvgCloseIcon
