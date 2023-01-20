import { ClipPath, Defs, G, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgCopy = (props: SvgProps) => {
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
      <G clipPath="url(#copy_svg__a)" strokeWidth={1.1}>
        <Path
          d="M8 3a2 2 0 0 0-2-2H4.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C1 2.52 1 3.08 1 4.2V6a2 2 0 0 0 2 2"
          stroke="#1B273D"
          strokeOpacity={0.3}
        />
        <Path
          d="M4 7.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C5.52 4 6.08 4 7.2 4h.6c1.12 0 1.68 0 2.108.218a2 2 0 0 1 .874.874C11 5.52 11 6.08 11 7.2v.6c0 1.12 0 1.68-.218 2.108a2 2 0 0 1-.874.874C9.48 11 8.92 11 7.8 11h-.6c-1.12 0-1.68 0-2.108-.218a2 2 0 0 1-.874-.874C4 9.48 4 8.92 4 7.8v-.6Z"
          stroke={color}
        />
      </G>
      <Defs>
        <ClipPath id="copy_svg__a">
          <Path fill="#fff" d="M0 0h12v12H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}
export default SvgCopy
