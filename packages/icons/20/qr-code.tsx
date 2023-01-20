import { Path, Rect, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgQrCode = (props: SvgProps) => {
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
      <Rect
        x={3.5}
        y={3.5}
        width={5}
        height={5}
        rx={1}
        stroke={color}
        strokeWidth={1.3}
      />
      <Path
        d="M12.869 11.881c.396-.396.594-.594.822-.668a1 1 0 0 1 .618 0c.228.074.426.272.822.668l.988.988c.396.396.594.594.668.822a1 1 0 0 1 0 .618c-.074.228-.272.426-.668.822l-.988.988c-.396.396-.594.594-.822.668a1 1 0 0 1-.618 0c-.228-.074-.426-.272-.822-.668l-.988-.988c-.396-.396-.594-.594-.668-.822a1 1 0 0 1 0-.618c.074-.228.272-.426.668-.822l.988-.988Z"
        stroke={color}
        strokeWidth={1.3}
      />
      <Rect
        x={11.5}
        y={3.5}
        width={5}
        height={5}
        rx={1}
        stroke={color}
        strokeWidth={1.3}
      />
      <Rect x={13.1} y={5.1} width={1.8} height={1.8} rx={0.5} fill={color} />
      <Rect
        x={3.5}
        y={11.5}
        width={5}
        height={5}
        rx={2.5}
        stroke={color}
        strokeWidth={1.3}
      />
      <Rect x={5.1} y={13.1} width={1.8} height={1.8} rx={0.9} fill={color} />
    </Svg>
  )
}
export default SvgQrCode
