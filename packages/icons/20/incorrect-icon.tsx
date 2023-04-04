import { useTheme } from '@tamagui/core'
import { Circle, Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgIncorrectIcon = (props: IconProps) => {
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
      <Circle cx={10} cy={10} r={7.5} stroke="#E95460" strokeWidth={1.2} />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="m10.75 5.5-.2 6h-1.1l-.2-6h1.5ZM10 13a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5Z"
        fill="#E95460"
      />
    </Svg>
  )
}
export default SvgIncorrectIcon
