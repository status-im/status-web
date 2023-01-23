import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgRotateIcon = (props: SvgProps) => {
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
        d="M10 2.35a7.65 7.65 0 0 0-6.214 3.187L3.26 4.304l-.92.392.983 2.3.147.344.373-.045 2.482-.299-.12-.992-1.258.151a6.35 6.35 0 0 1 10.553.67l1.126-.65A7.65 7.65 0 0 0 10 2.35Zm-.46 3.69a.65.65 0 0 1 .92 0l4.95 4.95a.65.65 0 0 1 0 .92l-4.95 4.95a.65.65 0 0 1-.92 0l-4.95-4.95a.65.65 0 0 1 0-.92l4.95-4.95ZM10 7.42l-4.03 4.03L10 15.48l4.03-4.03L10 7.42Z"
        fill="#000"
      />
    </Svg>
  )
}
export default SvgRotateIcon
