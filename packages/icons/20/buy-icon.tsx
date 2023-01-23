import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgBuyIcon = (props: SvgProps) => {
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
        d="M9.892 2.85h.217c1.29 0 2.059 0 2.71.156a5.65 5.65 0 0 1 4.175 4.175c.156.651.156 1.42.156 2.71v.218c0 1.29 0 2.059-.156 2.71a5.65 5.65 0 0 1-4.175 4.175c-.651.156-1.42.156-2.71.156h-.217c-1.292 0-2.06 0-2.71-.156a5.65 5.65 0 0 1-4.176-4.175c-.156-.651-.156-1.42-.156-2.71V9.89c0-1.29 0-2.059.156-2.71a5.65 5.65 0 0 1 4.175-4.175c.651-.156 1.42-.156 2.71-.156ZM10 4.15c-1.432 0-2.034.005-2.515.12A4.35 4.35 0 0 0 4.27 7.485c-.115.481-.12 1.083-.12 2.515 0 1.432.005 2.034.12 2.515a4.35 4.35 0 0 0 3.215 3.215c.481.115 1.083.12 2.515.12 1.432 0 2.034-.005 2.516-.12a4.35 4.35 0 0 0 3.214-3.215c.116-.481.12-1.083.12-2.515 0-1.432-.004-2.034-.12-2.515a4.35 4.35 0 0 0-3.214-3.215c-.482-.115-1.084-.12-2.516-.12Zm-.65 6.5H7v-1.3h2.35V7h1.3v2.35H13v1.3h-2.35V13h-1.3v-2.35Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgBuyIcon
