import { ClipPath, Defs, G, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgTrashIcon = (props: SvgProps) => {
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
      <G clipPath="url(#trash-icon_svg__a)" stroke={color} strokeWidth={1.1}>
        <Path d="M2.5 3.5v4.3c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C4.02 11 4.58 11 5.7 11h.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C9.5 9.48 9.5 8.92 9.5 7.8V3.5M8 3a2 2 0 1 0-4 0M5 5.5V8M7 5.5V8" />
        <Path d="M1 4s2.5-1 5-1 5 1 5 1" />
      </G>
      <Defs>
        <ClipPath id="trash-icon_svg__a">
          <Path fill="#fff" d="M0 0h12v12H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}
export default SvgTrashIcon
