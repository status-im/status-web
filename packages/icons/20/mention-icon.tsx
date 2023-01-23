import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgMentionIcon = (props: SvgProps) => {
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
        d="M11.915 2.852A7.4 7.4 0 1 0 13.7 16.41l-.65-1.126A6.1 6.1 0 1 1 16.1 10c0 .324-.029.779-.069 1.246-.053.62-.585 1.104-1.24 1.104-.63 0-1.14-.511-1.14-1.142V6.5h-1.3v.707a3.65 3.65 0 1 0 .346 5.254 2.44 2.44 0 0 0 2.095 1.189c1.297 0 2.42-.97 2.534-2.293.04-.474.074-.975.074-1.357a7.4 7.4 0 0 0-5.485-7.148ZM10 7.65a2.35 2.35 0 1 0 0 4.7 2.35 2.35 0 0 0 0-4.7Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgMentionIcon
