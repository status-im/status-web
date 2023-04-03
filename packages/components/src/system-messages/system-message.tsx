import { useState } from 'react'

import { TimeoutIcon } from '@status-im/icons/12'
import { AddUserIcon, DeleteIcon, PinIcon } from '@status-im/icons/20'
import { Stack, styled } from '@tamagui/core'
import { View } from 'react-native'

import { Avatar, IconAvatar } from '../avatar'
import { Button } from '../button'
import { Text } from '../text'

type User = {
  id: string
  name: string
  src: string
}

type Props = {
  state?: 'default' | 'pressed' | 'landed'
  timestamp: string
} & (
  | {
      type: 'pinned'
      actor: User
      message: {
        author: User
        text: string
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

const getIcon = {
  deleted: (
    <IconAvatar backgroundColor="$red-50-opa-5" color="$neutral-100">
      <DeleteIcon />
    </IconAvatar>
  ),
  pinned: (
    <IconAvatar backgroundColor="$blue-50-opa-5" color="$neutral-100">
      <PinIcon />
    </IconAvatar>
  ),
  added: (
    <IconAvatar backgroundColor="$blue-50-opa-5">
      <AddUserIcon />
    </IconAvatar>
  ),
}

const SystemMessage = (props: Props) => {
  console.log(props)

  const { state = 'default', timestamp, type } = props

  return (
    <Base
      flexDirection="row"
      space={8}
      padding={8}
      alignItems="stretch"
      state={
        type === 'deleted' && state === 'landed' ? 'landed_deleted' : state
      }
    >
      <IconAvatar backgroundColor="$turquoise-50-opa-5" color="$neutral-100">
        {getIcon[type]}
      </IconAvatar>
      {type === 'pinned' && (
        <Stack flexDirection="column" space={2}>
          <Stack flexDirection="row" space={4} alignItems="center">
            <Text size={13} weight="semibold">
              {props.actor?.name}
            </Text>
            <Text size={13}>pinned a message</Text>
            <Text size={11} color="$neutral-50">
              {timestamp}
            </Text>
          </Stack>
          <Stack flexDirection="row" space={4}>
            <Avatar size={16} src={props.message?.author.src} />
            <Text size={11} weight="semibold">
              {props.message?.author.name}
            </Text>
            <Text size={11}>{props.message.text}</Text>
          </Stack>
        </Stack>
      )}
      {type === 'deleted' && (
        <Stack flexDirection="row" space={2} justifyContent="space-between">
          <Stack
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            minWidth={800}
          >
            <>
              <Text size={13}>{props.text}</Text>
              <Text size={11} color="$neutral-50">
                {timestamp}
              </Text>
            </>
            {props.action && (
              <Button
                onPress={props?.action?.onClick}
                variant="darkGrey"
                size={24}
                icon={<TimeoutIcon />}
              >
                {props.action.label}
              </Button>
            )}
          </Stack>
        </Stack>
      )}
      {type === 'added' && (
        <Stack flexDirection="row" space={2}>
          <Stack flexDirection="row" space={4} alignItems="center">
            <Text size={13} weight="semibold">
              {props.actor?.name}
            </Text>
            <Text size={13}>added</Text>
            <Text size={13}>{props.users?.map(user => user.name)}</Text>
            <Text size={11} color="$neutral-50">
              {timestamp}
            </Text>
          </Stack>
        </Stack>
      )}
    </Base>
  )
}

export { SystemMessage }
export type { Props as SystemMessageProps }

const Base = styled(View, {
  backgroundColor: '$white-50',

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
