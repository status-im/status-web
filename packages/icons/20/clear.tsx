import { Circle, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgClear = (props: SvgProps) => {
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
      <Circle cx={10} cy={10} r={6.75} fill={color} />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 9.08 7.985 7.067l-.92.919L9.081 10l-2.016 2.015.92.92L10 10.918l2.015 2.015.92-.919L10.918 10l2.015-2.015-.919-.92L10 9.082Z"
        fill="#fff"
      />
    </Svg>
  )
}
export default SvgClear
