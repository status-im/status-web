import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgShareIcon = (props: SvgProps) => {
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
        d="M9.35 5.07 5.96 8.46l-.92-.92 4.5-4.5.46-.46.46.46 4.5 4.5-.92.92-3.39-3.39v8.43h-1.3V5.07Z"
        fill={color}
      />
      <Path
        d="M4 12v.2c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C6.28 17 7.12 17 8.8 17h2.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C16 14.72 16 13.88 16 12.2V12"
        stroke="#1B273D"
        strokeOpacity={0.3}
        strokeWidth={1.3}
      />
    </Svg>
  )
}
export default SvgShareIcon
