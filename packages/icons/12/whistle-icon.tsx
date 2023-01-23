import { Circle, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgWhistleIcon = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
  return (
    <Svg
      width={12}
      height={12}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M7.128 7.696A3 3 0 0 0 6.732 6l1.232-1.866-1-1.732-4.33 2.5a3 3 0 1 0 4.494 2.794Z"
        stroke={color}
        strokeWidth={1.1}
      />
      <Circle
        r={1}
        transform="scale(-1 1) rotate(30 -16.062 -3.964)"
        stroke={color}
        strokeWidth={1.1}
      />
    </Svg>
  )
}
export default SvgWhistleIcon
