import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgStickers = (props: SvgProps) => {
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
        d="M8 2h.667c1.24 0 1.86 0 2.368.136a4 4 0 0 1 2.829 2.829C14 5.473 14 6.093 14 7.333c0 1.55 0 2.325-.17 2.961a5 5 0 0 1-3.536 3.536c-.636.17-1.41.17-2.96.17-1.24 0-1.86 0-2.37-.136a4 4 0 0 1-2.828-2.829C2 10.527 2 9.907 2 8.667V8c0-1.864 0-2.796.304-3.53A4 4 0 0 1 4.47 2.303C5.204 2 6.136 2 8 2Z"
        stroke={color}
        strokeWidth={1.2}
      />
      <Path
        d="M13.8 9c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C9 11.28 9 12.12 9 13.8"
        stroke={color}
        strokeWidth={1.3}
      />
    </Svg>
  )
}
export default SvgStickers
