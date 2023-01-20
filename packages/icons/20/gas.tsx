import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgGas = (props: SvgProps) => {
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
        d="M4 7.5c0-1.398 0-2.097.228-2.648a3 3 0 0 1 1.624-1.624C6.403 3 7.102 3 8.5 3c1.398 0 2.097 0 2.648.228a3 3 0 0 1 1.624 1.624C13 5.403 13 6.102 13 7.5V17H4V7.5ZM4 9h9"
        stroke={color}
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.65 5.52V3h-1.3v2.52c.155-.02.356-.02.65-.02.294 0 .495 0 .65.02Zm0 3.96c-.155.02-.356.02-.65.02-.294 0-.495 0-.65-.02V13a.35.35 0 1 1-.7 0v-.8a1.85 1.85 0 0 0-1.85-1.85h-1.3v1.3h1.3a.55.55 0 0 1 .55.55v.8a1.65 1.65 0 1 0 3.3 0V9.48Z"
        fill={color}
      />
      <Path
        d="M15.5 7c0-.466 0-.699.076-.883a1 1 0 0 1 .541-.54c.184-.077.417-.077.883-.077s.699 0 .883.076a1 1 0 0 1 .54.541c.077.184.077.417.077.883v1c0 .466 0 .699-.076.883a1 1 0 0 1-.541.54c-.184.077-.417.077-.883.077s-.699 0-.883-.076a1 1 0 0 1-.54-.541C15.5 8.699 15.5 8.466 15.5 8V7Z"
        stroke={color}
        strokeWidth={1.3}
      />
    </Svg>
  )
}
export default SvgGas
