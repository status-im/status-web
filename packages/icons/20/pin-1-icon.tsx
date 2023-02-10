import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgPin1Icon = (props: SvgProps) => {
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
        d="m10.564 5.26 4.243 4.243-4.243 4.243-4.243-4.243 4.243-4.242ZM8.442 11.625 4.2 15.867M4.554 7.736l7.778 7.778M9.503 4.2l6.364 6.364"
        stroke={color}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
    </Svg>
  )
}
export default SvgPin1Icon
