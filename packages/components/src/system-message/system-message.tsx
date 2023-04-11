import { styled } from '@tamagui/core'
import { View } from 'react-native'

import { AddedUsersMessageContent } from './components/added-users-message-content'
import { DeletedMessageContent } from './components/deleted-message-content'
import { PinnedMessageContent } from './components/pinned-message-content'

type User = {
  id: string
  name: string
  src: string
}

type SystemMessageState = 'default' | 'pressed' | 'landed'

type Props = {
  state?: SystemMessageState
  timestamp: string
} & (
  | {
      type: 'pinned'
      user: User
      message: {
        author: User
        text: string
        images?: {
          type: 'photo' | 'gif'
          srcs: Array<string>
        }
      }
    }
  | {
      type: 'deleted'
      text: string
      action?: {
        label: string
        onClick: () => void
      }
    }
  | {
      type: 'added'
      user: User
      users: Array<User>
    }
)

const SystemMessage = (props: Props) => {
  const { state = 'default', timestamp, type } = props

  const renderMessage = (type: 'pinned' | 'deleted' | 'added') => {
    switch (type) {
      case 'pinned':
        return (
          <PinnedMessageContent
            timestamp={timestamp}
            user={props.user}
            message={props.message}
            state={state}
          />
        )
      case 'deleted':
        return (
          <DeletedMessageContent
            timestamp={timestamp}
            text={props.text}
            action={props.action}
            state={state}
          />
        )
      case 'added':
        return (
          <AddedUsersMessageContent
            timestamp={timestamp}
            user={props.user}
            users={props.users}
            state={state}
          />
        )
    }
  }

  return (
    <Base
      flexDirection="row"
      space={8}
      padding={8}
      alignItems="center"
      state={
        type === 'deleted' && state === 'landed' ? 'landed_deleted' : state
      }
    >
      {renderMessage(type)}
    </Base>
  )
}

export { SystemMessage }
export type { Props as SystemMessageProps, SystemMessageState, User }

const Base = styled(View, {
  backgroundColor: '$white-50',
  borderRadius: '$16',
  padding: 8,

  variants: {
    state: {
      default: {
        backgroundColor: '$white-50',
      },
      pressed: {
        backgroundColor: '$neutral-5',
      },
      landed: {
        backgroundColor: '$blue-50-opa-5',
      },
      landed_deleted: {
        backgroundColor: '$red-50-opa-5',
      },
    },
  },
})
