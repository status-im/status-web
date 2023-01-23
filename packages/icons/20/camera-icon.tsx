import { Circle, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgCameraIcon = (props: SvgProps) => {
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
        d="M3 8.556A3.056 3.056 0 0 1 6.056 5.5c.578 0 1.107-.327 1.366-.845L7.5 4.5c.306-.613.933-1 1.618-1h1.764c.685 0 1.312.387 1.618 1l.078.155c.258.518.788.845 1.366.845A3.056 3.056 0 0 1 17 8.556V11c0 1.396 0 2.093-.172 2.661a4 4 0 0 1-2.667 2.667c-.568.172-1.265.172-2.661.172h-3c-1.396 0-2.093 0-2.661-.172a4 4 0 0 1-2.667-2.667C3 13.093 3 12.396 3 11V8.556Z"
        stroke={color}
        strokeWidth={1.3}
      />
      <Circle cx={10} cy={10.5} r={3} stroke={color} strokeWidth={1.3} />
    </Svg>
  )
}
export default SvgCameraIcon
