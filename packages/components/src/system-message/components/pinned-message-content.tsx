import { Stack } from 'tamagui'

import { Avatar } from '../../avatar'
import { Text } from '../../text'

import type { User } from '../system-message'

type Props = {
  timestamp: string
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

const PinnedMessageContent = (props: Props) => {
  const { timestamp, actor, message } = props

  const { author, images, text } = message

  return (
    <Stack flexDirection="column" space={2}>
      <Stack flexDirection="row" space={4} alignItems="center">
        <Text size={13} weight="semibold">
          {actor.name}
        </Text>
        <Text size={13}>pinned a message</Text>
        <Text size={11} color="$neutral-50">
          {timestamp}
        </Text>
      </Stack>
      <Stack flexDirection="row" space={4}>
        <Avatar size={16} src={author.src} />
        <Text size={11} weight="semibold">
          {author.name}
        </Text>
        <Text size={11}>{images?.type === 'gif' ? 'GIF' : text}</Text>
        {images?.type === 'photo' && images.srcs.length > 0 && (
          <Text size={11} color="$neutral-50">
            {images.srcs.length} photos
          </Text>
        )}
      </Stack>
    </Stack>
  )
}

export { PinnedMessageContent }
