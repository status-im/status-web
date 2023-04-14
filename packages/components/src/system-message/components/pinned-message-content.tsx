import { PinIcon } from '@status-im/icons'
import { Stack } from 'tamagui'

import { Avatar } from '../../avatar'
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
      <Avatar
        type="icon"
        size={32}
        icon={<PinIcon size={20} />}
        backgroundColor={state === 'landed' ? '$transparent' : '$blue-50-opa-5'}
        color="$neutral-100"
      />
      <Stack
        flexDirection="column"
        gap={2}
        flexBasis="max-content"
        flexGrow={1}
      >
        <Stack flexDirection="row" gap={4} alignItems="baseline">
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
          gap={4}
          justifyContent="space-between"
          flexGrow={1}
          flexBasis="max-content"
        >
          <Stack flexDirection="row" gap={4}>
            <Avatar type="user" name={author.name} size={16} src={author.src} />
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
