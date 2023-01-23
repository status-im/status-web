import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgUnlockedIcon = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
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
        d="M8.065.9A3.035 3.035 0 0 1 11.1 3.935v1.228a3.6 3.6 0 0 1 2.127 2.405c.123.46.123.998.123 1.832v.2c0 .834 0 1.373-.123 1.832a3.6 3.6 0 0 1-2.545 2.545c-.46.123-.998.123-1.832.123H7.15c-.834 0-1.373 0-1.832-.123a3.6 3.6 0 0 1-2.545-2.545c-.123-.46-.123-.998-.123-1.832v-.2c0-.834 0-1.373.123-1.832a3.6 3.6 0 0 1 2.545-2.545c.46-.123.998-.123 1.832-.123H8.85c.414 0 .755 0 1.05.015v-.98a1.835 1.835 0 0 0-3.568-.602l-.265.764-1.134-.394.265-.764A3.035 3.035 0 0 1 8.065.9ZM7.25 6.1c-.969 0-1.335.005-1.621.082a2.4 2.4 0 0 0-1.697 1.697c-.077.286-.082.652-.082 1.621s.005 1.335.082 1.621a2.4 2.4 0 0 0 1.697 1.697c.286.077.652.082 1.621.082h1.5c.969 0 1.335-.005 1.621-.082a2.4 2.4 0 0 0 1.697-1.697c.077-.286.082-.652.082-1.621s-.005-1.335-.082-1.621a2.4 2.4 0 0 0-1.697-1.697C10.085 6.105 9.72 6.1 8.75 6.1h-1.5Zm.15 2.15h1.2v2.5H7.4v-2.5Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgUnlockedIcon
