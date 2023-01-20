import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgToken = (props: SvgProps) => {
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
        d="M9.265 4.483A5.65 5.65 0 0 0 6.56 14.577l-.46 1.715 1.256.336.366-1.366a5.65 5.65 0 0 0 1.642.44l-.366 1.366 1.256.337.46-1.715.012-.002a5.65 5.65 0 0 0 3.258-1.606l-.92-.92a4.35 4.35 0 1 1 1.127-4.201l1.255-.337a5.65 5.65 0 0 0-2.018-3.02l-.01-.008.46-1.714-1.257-.337-.366 1.366a5.651 5.651 0 0 0-1.641-.44l.366-1.366-1.256-.336-.46 1.714Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgToken
