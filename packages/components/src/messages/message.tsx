import { useState } from 'react'

import { PinIcon } from '@status-im/icons'
import { Stack, styled, Unspaced, XStack, YStack } from 'tamagui'

import { Author } from '../author'
import { Avatar } from '../avatar'
import { Image } from '../image'
import { useChatDispatch } from '../provider'
import { Reply } from '../reply'
import { Text } from '../text'
import { Actions } from './components/actions'
import { Reactions } from './components/reactions'

import type { ReactionsType } from './types'

export interface MessageProps {
  id: string
  text?: React.ReactNode
  images?: Array<{ url: string }>
  reactions: ReactionsType
  reply?: boolean
  pinned?: boolean
}

const Base = styled(Stack, {
  position: 'relative',
  paddingHorizontal: 8,
  paddingVertical: 8,
  borderRadius: '$16',
  alignItems: 'flex-start',

  variants: {
    active: {
      true: {
        backgroundColor: '$neutral-5',
      },
    },

    pinned: {
      true: {
        backgroundColor: '$blue-50-opa-5',
      },
    },
  } as const,
})

const Message = (props: MessageProps) => {
  const { text, images, reactions, reply, pinned } = props

  const [hovered, setHovered] = useState(false)
  const [showActions, setShowActions] = useState(false)

  const active = showActions || hovered
  const hasReactions = Object.keys(reactions).length > 0
  // <Sheet press="long">

  const dispatch = useChatDispatch()

  return (
    <Base
      active={active}
      pinned={pinned}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
    >
      {active && (
        <Unspaced>
          <Actions
            reactions={reactions}
            onOpenChange={setShowActions}
            onReplyPress={() => dispatch({ type: 'reply', messageId: '1' })}
            onEditPress={() => dispatch({ type: 'edit', messageId: '1' })}
            pinned={pinned}
          />
        </Unspaced>
      )}

      {reply && (
        <Stack paddingLeft={16} paddingBottom={12}>
          <Reply
            type="text"
            name="Alisher"
            src="https://images.unsplash.com/photo-1524638431109-93d95c968f03?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8Z2lybHx8fHx8fDE2NzM4ODQ0NzU&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500"
          />
        </Stack>
      )}

      {pinned && (
        <Stack
          flexDirection="row"
          alignItems="center"
          paddingLeft={40}
          paddingBottom={2}
          gap={2}
        >
          <PinIcon size={16} color="$blue-50" />
          <Text size={11} weight="medium" color="$blue-50">
            Steve
          </Text>
        </Stack>
      )}

      <XStack gap={10}>
        <Avatar
          type="user"
          name=""
          size={32}
          src="https://images.unsplash.com/photo-1524638431109-93d95c968f03?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8Z2lybHx8fHx8fDE2NzM4ODQ0NzU&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500"
          indicator="online"
        />

        <YStack flex={1}>
          <Author
            name="Alisher Yakupov"
            address="zQ3...9d4Gs0"
            status="verified"
            time="09:30"
          />

          {text && (
            <Text
              size={15}
              // flexGrow={0}
              // userSelect="text"
            >
              {text}
            </Text>
          )}

          {images?.map(image => (
            <Stack
              key={image.url}
              marginTop={8}
              $gtMd={{
                maxWidth: 320,
              }}
            >
              <Image src={image.url} width="full" height={320} radius={12} />
            </Stack>
          ))}

          {hasReactions && (
            <Stack paddingTop={8}>
              <Reactions reactions={reactions} />
            </Stack>
          )}
        </YStack>
      </XStack>
    </Base>
  )
}

export { Message }
