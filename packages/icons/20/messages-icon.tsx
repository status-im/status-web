import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgMessagesIcon = (props: SvgProps) => {
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
        d="M16.75 10a6.75 6.75 0 0 0-13.5 0v.28c0 1.172.347 2.317.997 3.292.026.04.036.089.026.136l-.54 2.56 2.56-.541c.046-.01.095 0 .135.026.975.65 2.12.997 3.292.997H10A6.75 6.75 0 0 0 16.75 10ZM7.5 8.5h5M7.5 11.5h4"
        stroke={color}
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
    </Svg>
  )
}
export default SvgMessagesIcon
