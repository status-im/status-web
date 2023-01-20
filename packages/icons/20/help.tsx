import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgHelp = (props: SvgProps) => {
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
        d="M4.308 7.802a6.12 6.12 0 0 1 3.494-3.494l.64 2.39a3.665 3.665 0 0 0-1.744 1.744l-2.39-.64Zm-.336 1.256a6.146 6.146 0 0 0 0 1.884l2.39-.64a3.697 3.697 0 0 1 0-.604l-2.39-.64Zm.336 3.14a6.12 6.12 0 0 0 3.494 3.494l.64-2.39a3.665 3.665 0 0 1-1.744-1.744l-2.39.64ZM10 16.1c-.32 0-.635-.025-.942-.072l.64-2.39a3.72 3.72 0 0 0 .604 0l.64 2.39A6.145 6.145 0 0 1 10 16.1Zm2.198-.408a6.12 6.12 0 0 0 3.494-3.494l-2.39-.64a3.665 3.665 0 0 1-1.744 1.744l.64 2.39Zm1.44-5.39 2.39.64a6.149 6.149 0 0 0 0-1.884l-2.39.64a3.72 3.72 0 0 1 0 .604Zm-1.44-5.994a6.12 6.12 0 0 1 3.494 3.494l-2.39.64a3.664 3.664 0 0 0-1.744-1.744l.64-2.39Zm-1.256-.336a6.146 6.146 0 0 0-1.884 0l.64 2.39a3.698 3.698 0 0 1 .604 0l.64-2.39ZM10 2.6a7.4 7.4 0 1 0 0 14.8 7.4 7.4 0 0 0 0-14.8ZM7.65 10a2.35 2.35 0 1 1 4.7 0 2.35 2.35 0 0 1-4.7 0Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgHelp
