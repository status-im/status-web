import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgFlipIcon = (props: SvgProps) => {
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
        d="M7.073 2.932a7.65 7.65 0 0 1 8.337 1.659l-.92.919A6.35 6.35 0 0 0 3.682 9.364L4.7 8.6l.6.8-2 1.5-.3.225-.3-.225-2-1.5.6-.8 1.073.805a7.65 7.65 0 0 1 4.7-6.473Zm5.855 14.136a7.65 7.65 0 0 1-8.337-1.659l.92-.919a6.35 6.35 0 0 0 10.725-3.292l-.936.702-.6-.8 2-1.5.3-.225.3.225 2 1.5-.6.8-1.123-.843a7.65 7.65 0 0 1-4.65 6.01ZM8.15 10a1.85 1.85 0 1 1 3.7 0 1.85 1.85 0 0 1-3.7 0ZM10 6.85a3.15 3.15 0 1 0 0 6.3 3.15 3.15 0 0 0 0-6.3Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgFlipIcon
