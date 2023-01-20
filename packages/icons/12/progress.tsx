import { ClipPath, Defs, G, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgProgress = (props: SvgProps) => {
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
      <G clipPath="url(#progress_svg__a)" strokeWidth={1.1}>
        <Path d="M6 1a5 5 0 1 1 0 10A5 5 0 0 1 6 1Z" stroke="#E7EAEE" />
        <Path d="M6 1a5 5 0 0 1 4.755 3.455" stroke={color} />
      </G>
      <Defs>
        <ClipPath id="progress_svg__a">
          <Path fill="#fff" d="M0 0h12v12H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}
export default SvgProgress
