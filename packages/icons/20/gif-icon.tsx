import { useTheme } from '@tamagui/core'
import { Path, Rect, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgGifIcon = (props: IconProps) => {
  const { color: token = '$neutral-100' } = props
  const theme = useTheme()
  /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const color = theme[token]?.val ?? token
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
        width={13}
        height={13}
        rx={4}
        stroke={color}
        strokeWidth={1.3}
      />
      <Path
        d="m8.204 9.312.011.035H9.041l-.01-.058a1.482 1.482 0 0 0-.193-.543 1.54 1.54 0 0 0-.378-.424 1.682 1.682 0 0 0-.52-.274 1.969 1.969 0 0 0-.627-.098 1.91 1.91 0 0 0-.738.14 1.679 1.679 0 0 0-.593.408c-.17.178-.3.393-.394.646-.092.254-.138.54-.138.86 0 .417.078.78.235 1.087.16.306.38.543.663.71.285.167.614.249.986.249.334 0 .632-.067.892-.201.261-.137.467-.33.616-.582.15-.252.223-.55.223-.89v-.518H7.36V10.51h.91a.9.9 0 0 1-.11.395.761.761 0 0 1-.322.303 1.072 1.072 0 0 1-.5.109c-.213 0-.398-.05-.556-.15a1.01 1.01 0 0 1-.374-.445 1.729 1.729 0 0 1-.136-.726c0-.286.046-.526.136-.72.092-.197.217-.344.374-.443a.99.99 0 0 1 .541-.15c.115 0 .22.015.314.044a.804.804 0 0 1 .44.322h.001a.95.95 0 0 1 .127.263Zm-.344 1.94c-.147.077-.321.115-.522.115-.222 0-.416-.053-.584-.158a1.06 1.06 0 0 1-.392-.466 1.778 1.778 0 0 1-.141-.747c0-.291.047-.538.14-.741l1.499 1.998Zm2.909-3.199v-.05H9.952V11.997H10.769V8.053Zm1.146 3.894v.05H12.73V10.343h1.645V9.652h-1.645v-.958h1.819V8.004h-2.635V11.946Z"
        fill={color}
        stroke={color}
        strokeWidth={0.1}
      />
    </Svg>
  )
}
export default SvgGifIcon
