import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgSearchIcon = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
  return (
    <Svg
      width={12}
      height={12}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.1 5.382a3.282 3.282 0 1 1 6.565 0 3.282 3.282 0 0 1-6.565 0ZM5.382 1a4.382 4.382 0 1 0 2.686 7.846l2.153 2.152.778-.777-2.153-2.153A4.382 4.382 0 0 0 5.382 1Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgSearchIcon
