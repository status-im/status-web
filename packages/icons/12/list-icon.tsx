import { ClipPath, Defs, G, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgListIcon = (props: SvgProps) => {
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
      <G clipPath="url(#list-icon_svg__a)" stroke={color} strokeWidth={1.1}>
        <Path d="M1 2.5c0-.465 0-.697.051-.888a1.5 1.5 0 0 1 1.06-1.06C2.304.5 2.536.5 3 .5h6c.465 0 .697 0 .888.051a1.5 1.5 0 0 1 1.06 1.06c.052.192.052.424.052.889s0 .697-.051.888a1.5 1.5 0 0 1-1.06 1.06C9.696 4.5 9.464 4.5 9 4.5H3c-.465 0-.697 0-.888-.051a1.5 1.5 0 0 1-1.06-1.06C1 3.196 1 2.964 1 2.5ZM1 9.5c0-.465 0-.697.051-.888a1.5 1.5 0 0 1 1.06-1.06C2.304 7.5 2.536 7.5 3 7.5h6c.465 0 .697 0 .888.051a1.5 1.5 0 0 1 1.06 1.06c.052.192.052.424.052.889s0 .697-.051.888a1.5 1.5 0 0 1-1.06 1.06c-.192.052-.424.052-.889.052H3c-.465 0-.697 0-.888-.051a1.5 1.5 0 0 1-1.06-1.06C1 10.197 1 9.964 1 9.5Z" />
      </G>
      <Defs>
        <ClipPath id="list-icon_svg__a">
          <Path fill="#fff" d="M0 0h12v12H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}
export default SvgListIcon
