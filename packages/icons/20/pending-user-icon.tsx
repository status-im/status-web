import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgPendingUserIcon = (props: SvgProps) => {
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
        d="M8.15 6a1.85 1.85 0 1 1 3.7 0 1.85 1.85 0 0 1-3.7 0ZM10 2.85a3.15 3.15 0 1 0 0 6.3 3.15 3.15 0 0 0 0-6.3Zm1.65 10.65a2.35 2.35 0 1 1 4.7 0 2.35 2.35 0 0 1-4.7 0ZM14 9.85a3.65 3.65 0 1 0 0 7.3 3.65 3.65 0 0 0 0-7.3ZM13.35 12v1.77l.19.19 1 1 .92-.92-.81-.81V12h-1.3Zm-5.6-.35a3.1 3.1 0 0 0-3.1 3.1.6.6 0 0 0 .6.6H9.5v1.3H5.25a1.9 1.9 0 0 1-1.9-1.9 4.4 4.4 0 0 1 4.4-4.4H9.5v1.3H7.75Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgPendingUserIcon
