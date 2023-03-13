import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgCollapseIcon = (props: IconProps) => {
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
        d="M10.85 2.5v6.65h6.65v-1.3h-5.35V2.5h-1.3ZM2.5 12.15h5.35v5.35h1.3v-6.65H2.5v1.3Z"
        fill="#000"
      />
    </Svg>
  )
}
export default SvgCollapseIcon
