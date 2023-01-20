import { Circle, ClipPath, Defs, G, Path, Rect, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgRemove = (props: SvgProps) => {
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
      <G clipPath="url(#remove_svg__a)">
        <Circle cx={6} cy={6} r={6} fill="#647084" />
        <Path
          d="M3.879 3.879 8.12 8.12M8.121 3.879 3.88 8.12"
          stroke="#fff"
          strokeWidth={1.1}
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="remove_svg__a">
          <Rect width={12} height={12} rx={6} fill="#fff" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}
export default SvgRemove
