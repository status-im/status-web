import { useTheme } from '@tamagui/core'
import { ClipPath, Defs, G, Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgVerified1Icon = (props: IconProps) => {
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
      <G clipPath="url(#verified-1-icon_svg__a)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.43 1.156 6 .62l-.43.536-1.7 2.125-2.087-1.253-.91-.546.079 1.059.454 6.132.002.034c.02.276.04.539.223.851.078.133.16.243.266.341.091.085.189.15.262.198l.013.008c.652.429 1.852.945 3.828.945 1.976 0 3.176-.516 3.828-.945l.013-.008c.073-.049.171-.113.262-.198.106-.098.188-.208.266-.34.183-.313.203-.576.223-.852l.002-.034.455-6.132.078-1.059-.91.546L8.13 3.281l-1.7-2.125Zm-2 3.188L6 2.38l1.57 1.964.3.375.413-.247 1.59-.954-.338 4.559a5.14 5.14 0 0 0-.206-.088C8.632 7.711 7.562 7.45 6 7.45c-1.562 0-2.632.26-3.33.54-.072.028-.14.058-.205.087l-.338-4.56 1.59.955.412.247.3-.375Zm-1.687 4.82.034.022c.462.304 1.45.764 3.223.764 1.774 0 2.761-.46 3.223-.764l.034-.022a3.722 3.722 0 0 0-.336-.153C8.368 8.789 7.438 8.55 6 8.55c-1.439 0-2.369.24-2.922.46a3.721 3.721 0 0 0-.336.154Z"
          fill={color}
        />
      </G>
      <Defs>
        <ClipPath id="verified-1-icon_svg__a">
          <Path fill="#fff" d="M0 0h12v12H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}
export default SvgVerified1Icon
