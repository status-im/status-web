import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgSearchIcon = (props: IconProps) => {
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
        d="M4.15 9a4.85 4.85 0 1 1 9.7 0 4.85 4.85 0 0 1-9.7 0ZM9 2.85a6.15 6.15 0 1 0 3.865 10.934l3.175 3.176.92-.92-3.176-3.175A6.15 6.15 0 0 0 9 2.85Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgSearchIcon
