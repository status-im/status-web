import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgDownload = (props: SvgProps) => {
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
        d="M10.65 11.93V3h-1.3v8.93L5.96 8.54l-.92.92 4.5 4.5.46.46.46-.46 4.5-4.5-.92-.92-3.39 3.39Z"
        fill={color}
      />
      <Path
        d="M16 17H4"
        stroke="#1B273D"
        strokeOpacity={0.3}
        strokeWidth={1.3}
      />
    </Svg>
  )
}
export default SvgDownload
