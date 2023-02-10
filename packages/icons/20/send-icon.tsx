import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgSendIcon = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
  return (
    <Svg
      width={20}
      height={20}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.35 4.57 5.96 7.96l-.92-.92 4.5-4.5.46-.46.46.46 4.5 4.5-.92.92-3.39-3.39v8.93h-1.3V4.57Z"
        fill={color}
      />
      <Path
        d="M6 16s1.5 1 4 1 4-1 4-1"
        stroke="#1B273D"
        strokeOpacity={0.3}
        strokeWidth={1.3}
      />
    </Svg>
  )
}
export default SvgSendIcon
