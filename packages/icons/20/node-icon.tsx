import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgNodeIcon = (props: IconProps) => {
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
        d="M3.65 5.5a1.85 1.85 0 1 1 3.7 0 1.85 1.85 0 0 1-3.7 0ZM5.5 2.35a3.15 3.15 0 0 0-.65 6.233v2.834a3.151 3.151 0 1 0 1.3 0V8.583A3.154 3.154 0 0 0 8.583 6.15c.884.001 1.551.008 2.091.052.627.052 1.026.15 1.347.313a3.35 3.35 0 0 1 1.464 1.464c.164.321.262.72.313 1.347.044.54.05 1.207.052 2.091a3.151 3.151 0 1 0 1.3 0c0-.883-.008-1.602-.056-2.197-.058-.707-.178-1.296-.45-1.83a4.65 4.65 0 0 0-2.033-2.033c-.535-.273-1.123-.392-1.83-.45-.596-.049-1.314-.056-2.198-.057A3.151 3.151 0 0 0 5.5 2.35Zm0 10.3a1.85 1.85 0 1 0 0 3.7 1.85 1.85 0 0 0 0-3.7Zm7.15 1.85a1.85 1.85 0 1 1 3.7 0 1.85 1.85 0 0 1-3.7 0Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgNodeIcon
