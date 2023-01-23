import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgEditIcon = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
  return (
    <Svg
      width={12}
      height={12}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M5.94 3.182c.396-.396.594-.594.822-.669a1 1 0 0 1 .618 0c.228.075.426.273.822.669l.566.565c.396.396.594.594.668.823a1 1 0 0 1 0 .618c-.074.228-.272.426-.668.822l-2.85 2.85c-.2.2-.3.3-.417.367a1 1 0 0 1-.337.118c-.133.021-.274.005-.554-.026l-1.782-.198-.198-1.78c-.03-.282-.046-.422-.025-.555a1 1 0 0 1 .118-.337c.067-.117.167-.217.366-.417l2.85-2.85ZM4.839 3.575l3.535 3.536"
        stroke={color}
        strokeWidth={1.1}
        strokeLinejoin="round"
      />
    </Svg>
  )
}
export default SvgEditIcon
