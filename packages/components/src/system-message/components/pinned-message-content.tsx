import { PinIcon } from '@status-im/icons/20'
import { Stack } from 'tamagui'

import { Avatar, IconAvatar } from '../../avatar'
import { Text } from '../../text'

import type { SystemMessageState, User } from '../system-message'

type Props = {
  timestamp: string
  user: User
  message: {
    author: User
    text: string
    images?: {
      type: 'photo' | 'gif'
      srcs: Array<string>
    }
  }
  state: SystemMessageState
}

const PinnedMessageContent = (props: Props) => {
  const { timestamp, user, message, state } = props

  const { author, images, text } = message

  return (
    <>
      <IconAvatar
        backgroundColor={state === 'landed' ? '$transparent' : '$blue-50-opa-5'}
        color="$neutral-100"
      >
        <PinIcon />
      </IconAvatar>
      <Stack
        flexDirection="column"
        space={2}
        flexBasis="max-content"
        flexGrow={1}
      >
        <Stack flexDirection="row" space={4} alignItems="baseline">
          <Text size={13} weight="semibold">
            {user.name}
          </Text>
          <Text size={13}>pinned a message</Text>
          <Text size={11} color="$neutral-50">
            {timestamp}
          </Text>
        </Stack>
        <Stack
          flexDirection="row"
          space={4}
          justifyContent="space-between"
          flexGrow={1}
          flexBasis="max-content"
        >
          <Stack flexDirection="row" space={4}>
            <Avatar size={16} src={author.src} />
            <Text size={11} weight="semibold">
              {author.name}
            </Text>
            <Text size={11}>{images?.type === 'gif' ? 'GIF' : text}</Text>
          </Stack>
          {images?.type === 'photo' && images.srcs.length > 0 && (
            <Text size={11} color="$neutral-50">
              {images.srcs.length} photos
            </Text>
          )}
        </Stack>
      </Stack>
    </>
  )
}

export { PinnedMessageContent }
