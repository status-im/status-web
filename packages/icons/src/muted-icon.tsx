import { memo } from 'react'

import { themed } from '@status-im/icons/src/themed'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from './types'

function Icon(props: IconProps) {
  const { color, size = 16, ...otherProps } = props

  return (
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      {...otherProps}
    >
      <Path
        d="M5.655 4.735A5.15 5.15 0 0 1 15.15 7.5v.75a3.1 3.1 0 0 0 .62 1.86l.45.6a2.15 2.15 0 0 1-1.212 3.38l2.523 2.523-.92.919-3.38-3.382H5.5a2.15 2.15 0 0 1-1.72-3.44l.45-.6a3.1 3.1 0 0 0 .62-1.86V7.5c0-.524.079-1.03.224-1.507L2.471 3.39l.919-.92 2.265 2.265Zm.517 2.356a3.894 3.894 0 0 0-.022.409v.75a4.4 4.4 0 0 1-.88 2.64l-.45.6a.85.85 0 0 0 .68 1.36h6.431l-5.76-5.76Zm7.598 5.759L6.604 5.685A3.85 3.85 0 0 1 13.85 7.5v.75a4.4 4.4 0 0 0 .88 2.64l.45.6a.85.85 0 0 1-.68 1.36h-.73Zm-2.373 4.522a3.649 3.649 0 0 1-3.978-.791l.92-.92a2.35 2.35 0 0 0 3.323 0l.919.92a3.65 3.65 0 0 1-1.184.791Z"
        fill={`${color}`}
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </Svg>
  )
}

export const MutedIcon = memo<IconProps>(themed(Icon))
