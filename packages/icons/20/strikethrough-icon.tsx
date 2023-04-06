import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgStrikethroughIcon = (props: IconProps) => {
  const { color: token = '$neutral-100' } = props
  const theme = useTheme()
  /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const color = theme[token]?.val ?? token
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
        d="M6 7a3.75 3.75 0 0 1 3.75-3.75H10a4 4 0 0 1 4 4v.25a.75.75 0 0 1-1.5 0v-.25a2.5 2.5 0 0 0-2.5-2.5h-.25a2.25 2.25 0 0 0 0 4.5h4.5a.75.75 0 0 1 0 1.5h-1a3.75 3.75 0 0 1-3 6H10a4 4 0 0 1-4-4v-.25a.75.75 0 0 1 1.5 0v.25a2.5 2.5 0 0 0 2.5 2.5h.25a2.25 2.25 0 0 0 0-4.5h-4.5a.75.75 0 0 1 0-1.5h1A3.733 3.733 0 0 1 6 7Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgStrikethroughIcon
