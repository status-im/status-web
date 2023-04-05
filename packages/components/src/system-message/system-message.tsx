import { AddUserIcon, DeleteIcon, PinIcon } from '@status-im/icons/20'
import { styled } from '@tamagui/core'
import { View } from 'react-native'

import { IconAvatar } from '../avatar'
import { AddedUsersMessageContent } from './components/added-users-message-content'
import { DeletedMessageContent } from './components/deleted-message-content'
import { PinnedMessageContent } from './components/pinned-message-content'

type User = {
  id: string
  name: string
  src: string
}

type SystemMessageType = 'pinned' | 'deleted' | 'added'
type SystemMessageState = 'default' | 'pressed' | 'landed'

type Props = {
  state?: SystemMessageState
  timestamp: string
} & (
  | {
      type: 'pinned'
      actor: User
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
      actor: User
      users: Array<User>
    }
)

const getIcon = (type: SystemMessageType, state: SystemMessageState) => {
  switch (type) {
    case 'deleted':
      return (
        <IconAvatar
          backgroundColor={
            state === 'landed' ? '$transparent' : '$red-50-opa-5'
          }
          color="$neutral-100"
        >
          <DeleteIcon />
        </IconAvatar>
      )
    case 'pinned':
      return (
        <IconAvatar
          backgroundColor={
            state === 'landed' ? '$transparent' : '$blue-50-opa-5'
          }
          color="$neutral-100"
        >
          <PinIcon />
        </IconAvatar>
      )
    case 'added':
      return (
        <IconAvatar
          backgroundColor={
            state === 'landed' ? '$transparent' : '$blue-50-opa-5'
          }
          color="$blue-50"
        >
          <AddUserIcon />
        </IconAvatar>
      )
  }
}

const SystemMessage = (props: Props) => {
  const { state = 'default', timestamp, type } = props

  const renderMessage = (type: 'pinned' | 'deleted' | 'added') => {
    switch (type) {
      case 'pinned':
        return (
          <PinnedMessageContent
            timestamp={timestamp}
            actor={props.actor}
            message={props.message}
          />
        )
      case 'deleted':
        return (
          <DeletedMessageContent
            timestamp={timestamp}
            text={props.text}
            action={props.action}
          />
        )
      case 'added':
        return (
          <AddedUsersMessageContent
            timestamp={timestamp}
            actor={props.actor}
            users={props.users}
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
      {getIcon(type, state)}
      {renderMessage(type)}
    </Base>
  )
}

export { SystemMessage }
export type { Props as SystemMessageProps, User }

const Base = styled(View, {
  backgroundColor: '$white-50',
  borderRadius: 16, // switch to borderRadius tokens once merged => '$16'
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
