import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgCustomizeIcon = (props: SvgProps) => {
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
        d="M3.85 8.98c.155.02.356.02.65.02.294 0 .495 0 .65-.02V16h-1.3V8.98Zm0-3.46c.155-.02.356-.02.65-.02.294 0 .495 0 .65.02V3.5h-1.3v2.02ZM9.35 13.98c.155.02.356.02.65.02.294 0 .495 0 .65-.02v2.52h-1.3v-2.52Zm0-3.46c.155-.02.356-.02.65-.02.294 0 .495 0 .65.02V4h-1.3v6.52ZM14.85 8.98c.155.02.356.02.65.02.294 0 .495 0 .65-.02V16h-1.3V8.98Zm0-3.46c.155-.02.356-.02.65-.02.294 0 .495 0 .65.02V3.5h-1.3v2.02Z"
        fill="#1B273D"
        fillOpacity={0.3}
      />
      <Path
        d="M4.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 1 1 0 3ZM10 14a1.5 1.5 0 0 1 0-3 1.5 1.5 0 0 1 0 3ZM15.5 9a1.5 1.5 0 0 1 0-3 1.5 1.5 0 0 1 0 3Z"
        stroke={color}
        strokeWidth={1.3}
      />
    </Svg>
  )
}
export default SvgCustomizeIcon
