import { useTheme } from '@tamagui/core'
import { ClipPath, Defs, G, Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgCommunitiesIcon = (props: IconProps) => {
  const { color: token = '$neutral-100' } = props
  const theme = useTheme()
  /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const color = theme[token]?.val ?? token
  return (
    <Svg
      width={12}
      height={12}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G clipPath="url(#communities-icon_svg__a)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.55 10.09a8.54 8.54 0 0 1 8.54-8.54c.2 0 .36.16.36.36v1.792a6.686 6.686 0 0 0-6.748 6.748H1.909a.36.36 0 0 1-.36-.36Zm3.314.36h2.011c.389 0 .461-.006.506-.02a.45.45 0 0 0 .3-.3c.013-.044.019-.116.019-.505V9.56c0-.283 0-.537.067-.76A1.55 1.55 0 0 1 8.8 7.767c.223-.068.477-.067.76-.067h.065c.389 0 .461-.006.506-.02a.45.45 0 0 0 .3-.3c.013-.044.019-.116.019-.505V4.864a.064.064 0 0 0-.064-.064A5.586 5.586 0 0 0 4.8 10.386c0 .036.028.064.064.064Zm6.686-4.2v.69c0 .283 0 .537-.067.76a1.55 1.55 0 0 1-1.033 1.033c-.223.068-.477.067-.76.067h-.065c-.389 0-.461.006-.506.02a.45.45 0 0 0-.3.3c-.013.044-.02.116-.02.505l.001.065c0 .283 0 .537-.067.76A1.55 1.55 0 0 1 7.7 11.483c-.223.068-.477.067-.76.067H1.91A1.46 1.46 0 0 1 .45 10.09 9.64 9.64 0 0 1 10.09.45c.807 0 1.46.653 1.46 1.46v4.34Z"
          fill={color}
        />
      </G>
      <Defs>
        <ClipPath id="communities-icon_svg__a">
          <Path fill="#fff" d="M0 0h12v12H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}
export default SvgCommunitiesIcon
