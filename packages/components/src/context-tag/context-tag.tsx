import { styled } from '@tamagui/core'
import { View } from 'react-native'

import { Avatar } from '../avatar'
import { Text } from '../text'

type ContextTagType =
  | 'default'
  | 'group'
  | 'channel'
  | 'community'
  | 'token'
  | 'network'
  | 'account'
  | 'collectible'
  | 'address'
  | 'icon'
  | 'audio'

type Props = {
  children?: React.ReactNode
  src?: string
  path?: string
  type?: ContextTagType
  size?: 24 | 32
  outline?: boolean
}

const ContextTag = (props: Props) => {
  const { src, children, path, type = 'default', size = 24, outline } = props

  return (
    <Base outline={outline}>
      {src && <Avatar size={20} src={src} />}
      <Text size={11} weight="medium" color="$neutral-100">
        {path ? path : children}
      </Text>
    </Base>
  )
}

export { ContextTag }
export type { Props as ContextTagProps }

const Base = styled(View, {
  backgroundColor: '$neutral-10',
  paddingLeft: 3,
  paddingRight: 8,
  paddingVertical: 3,
  borderRadius: 20,
  display: 'inline-flex',
  space: 4,
  flexDirection: 'row',
  alignItems: 'center',

  borderColor: ({ outline }) => (outline ? '$neutral-20' : 'transparent'),
})
