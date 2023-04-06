import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgPrivacyIcon = (props: IconProps) => {
  const { color: token = '$neutral-100' } = props
  const theme = useTheme()
  /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const color = theme[token]?.val ?? token
  return (
    <Svg
      width={16}
      height={16}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.14 4.122a.4.4 0 0 1 .639-.192l1.837 1.53.42.352.388-.388 1.428-1.427a.4.4 0 0 1 .654.134L11.614 6.9H4.306l.834-2.778ZM3.054 6.9l.936-3.122a1.6 1.6 0 0 1 2.557-.77l1.416 1.18 1.04-1.04a1.6 1.6 0 0 1 2.617.537L12.906 6.9H14v1.2H2V6.9h1.054ZM5 10.6a1.15 1.15 0 1 0 0 2.3 1.15 1.15 0 0 0 0-2.3Zm-2.35 1.15a2.35 2.35 0 0 1 4.59-.716 3.31 3.31 0 0 1 1.52 0 2.351 2.351 0 1 1-.053 1.234 2.106 2.106 0 0 0-1.414 0 2.35 2.35 0 0 1-4.643-.518Zm7.2 0a1.15 1.15 0 1 1 2.3 0 1.15 1.15 0 0 1-2.3 0Z"
        fill="#000"
      />
    </Svg>
  )
}
export default SvgPrivacyIcon
