import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgCommunitiesIcon = (props: SvgProps) => {
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
        d="M15.633 4.15C9.291 4.15 4.15 9.291 4.15 15.633c0 .12.097.217.217.217h1.502c.323-5.364 4.617-9.658 9.981-9.98V4.367a.217.217 0 0 0-.217-.217ZM9.38 15.85H7.172a9.352 9.352 0 0 1 8.678-8.678V9.38a7.152 7.152 0 0 0-6.47 6.471Zm1.307 0h2.668a2.65 2.65 0 0 1 2.496-2.496v-2.668a5.852 5.852 0 0 0-5.164 5.164Zm-7.836-.217c0-7.06 5.723-12.783 12.783-12.783.838 0 1.517.679 1.517 1.517V13.5A1.15 1.15 0 0 1 16 14.65 1.35 1.35 0 0 0 14.65 16a1.15 1.15 0 0 1-1.15 1.15H4.367a1.517 1.517 0 0 1-1.517-1.517Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgCommunitiesIcon
