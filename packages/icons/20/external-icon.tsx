import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgExternalIcon = (props: SvgProps) => {
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
        d="M10.968 7.614H6.173v-1.3h7.014v7.014h-1.3V8.534l-5.962 5.961-.919-.92 5.962-5.96Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgExternalIcon
