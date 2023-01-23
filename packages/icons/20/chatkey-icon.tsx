import { Circle, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgChatkeyIcon = (props: SvgProps) => {
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
        d="M17.4 10a7.4 7.4 0 0 0-14.8 0v.28c0 1.233.346 2.44.997 3.484l-.5 2.37a.65.65 0 0 0 .77.77l2.37-.5c1.044.65 2.25.996 3.483.996H10a7.4 7.4 0 0 0 7.4-7.4ZM10 3.9a6.1 6.1 0 0 1 0 12.2h-.28a5.286 5.286 0 0 1-2.932-.888.828.828 0 0 0-.63-.12l-1.583.334.334-1.584a.828.828 0 0 0-.121-.63A5.285 5.285 0 0 1 3.9 10.28V10A6.1 6.1 0 0 1 10 3.9Z"
        fill={color}
      />
      <Circle cx={7.5} cy={10} r={1.5} stroke={color} strokeWidth={1.3} />
      <Path d="M8.5 10h5v2M11.5 10v1.5" stroke={color} strokeWidth={1.3} />
    </Svg>
  )
}
export default SvgChatkeyIcon
