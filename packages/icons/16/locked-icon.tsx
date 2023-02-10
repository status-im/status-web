import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgLockedIcon = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
  return (
    <Svg
      width={16}
      height={16}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 .9h-.012c-.081 0-.137 0-.186.002a3 3 0 0 0-2.9 2.9c-.002.05-.002.105-.002.186v1.175a3.6 3.6 0 0 0-2.127 2.405c-.123.46-.123.998-.123 1.832v.2c0 .834 0 1.373.123 1.832a3.6 3.6 0 0 0 2.545 2.545c.46.123.998.123 1.832.123H8.85c.834 0 1.373 0 1.832-.123a3.6 3.6 0 0 0 2.545-2.545c.123-.46.123-.998.123-1.832v-.2c0-.834 0-1.373-.123-1.832A3.6 3.6 0 0 0 11.1 5.163V3.988c0-.081 0-.137-.002-.186A3 3 0 0 0 8.012.9H8Zm.75 5.2h-1.5c-.969 0-1.335.005-1.621.082a2.4 2.4 0 0 0-1.697 1.697c-.077.286-.082.652-.082 1.621s.005 1.335.082 1.621a2.4 2.4 0 0 0 1.697 1.697c.286.077.652.082 1.621.082h1.5c.969 0 1.335-.005 1.621-.082a2.4 2.4 0 0 0 1.697-1.697c.077-.286.082-.652.082-1.621s-.005-1.335-.082-1.621a2.4 2.4 0 0 0-1.697-1.697C10.085 6.105 9.72 6.1 8.75 6.1Zm.288-1.2H9.9V3.841a1.8 1.8 0 0 0-1.741-1.74 5.726 5.726 0 0 0-.318 0 1.8 1.8 0 0 0-1.74 1.74V4.9H9.037ZM7.4 8.25h1.2v2.5H7.4v-2.5Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgLockedIcon
