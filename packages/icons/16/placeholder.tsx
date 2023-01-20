import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgPlaceholder = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
  return (
    <Svg
      width={16}
      height={16}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 2.6a5.377 5.377 0 0 0-3.37 1.18L8 7.152l3.37-3.37A5.377 5.377 0 0 0 8 2.6Zm4.22 2.03L8.848 8l3.37 3.37A5.378 5.378 0 0 0 13.4 8a5.378 5.378 0 0 0-1.18-3.37ZM7.15 8l-3.37-3.37A5.377 5.377 0 0 0 2.6 8c0 1.275.442 2.447 1.18 3.37L7.153 8ZM4.63 12.22 8 8.848l3.37 3.37A5.377 5.377 0 0 1 8 13.4a5.377 5.377 0 0 1-3.37-1.18ZM1.4 8a6.6 6.6 0 1 1 13.2 0A6.6 6.6 0 0 1 1.4 8Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgPlaceholder
