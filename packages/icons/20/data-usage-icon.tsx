import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgDataUsageIcon = (props: SvgProps) => {
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
        d="M8.8 2.35h-.028c-.816 0-1.468 0-1.995.043-.54.044-1.006.137-1.434.355a3.65 3.65 0 0 0-1.595 1.595c-.218.428-.31.893-.355 1.434-.043.526-.043 1.179-.043 1.995V12.228c0 .816 0 1.469.043 1.995.044.54.137 1.006.355 1.434a3.65 3.65 0 0 0 1.595 1.595c.428.218.893.31 1.434.355.527.043 1.179.043 1.995.043h2.456c.816 0 1.469 0 1.995-.043.54-.044 1.006-.137 1.434-.355a3.65 3.65 0 0 0 1.595-1.595c.218-.428.31-.893.355-1.434.043-.527.043-1.179.043-1.995V7.772c0-.816 0-1.469-.043-1.995-.044-.54-.137-1.006-.355-1.434a3.65 3.65 0 0 0-1.595-1.595c-.428-.218-.893-.31-1.434-.355-.526-.043-1.179-.043-1.995-.043H8.8ZM5.933 3.906c.214-.109.49-.18.95-.217C7.35 3.65 7.949 3.65 8.8 3.65h2.4c.85 0 1.45 0 1.918.039.46.037.735.108.949.217a2.35 2.35 0 0 1 1.027 1.027c.109.214.18.49.217.95.039.467.04 1.066.04 1.917v4.4c0 .85-.001 1.45-.04 1.918-.037.46-.108.735-.217.949a2.35 2.35 0 0 1-1.027 1.027c-.214.109-.49.18-.95.217-.467.038-1.066.039-1.917.039H8.8c-.85 0-1.45 0-1.917-.039-.46-.037-.736-.108-.95-.217a2.35 2.35 0 0 1-1.027-1.027c-.109-.214-.18-.49-.217-.95-.038-.467-.039-1.066-.039-1.917V7.8c0-.85 0-1.45.039-1.917.037-.46.108-.736.217-.95a2.35 2.35 0 0 1 1.027-1.027ZM8.5 15.15h3v-1.3h-3v1.3Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgDataUsageIcon
