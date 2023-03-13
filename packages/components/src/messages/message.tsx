import { PinIcon } from '@status-im/icons/16'
import { View } from 'react-native'
import { Stack, styled, Unspaced, XStack, YStack } from 'tamagui'

import { Author } from '../author/author'
import { Avatar } from '../avatar'
import { Image } from '../image'
import { useChatDispatch } from '../provider'
import { Reply } from '../reply'
import { Paragraph } from '../typography'
import { Actions } from './components/actions'
import { Reactions } from './components/reactions'

import type { ReactionsType } from './types'

interface Props {
  text?: React.ReactNode
  images?: Array<{ url: string }>
  reactions: ReactionsType
  reply?: boolean
  pinned?: boolean
}

const Wrapper = styled(View, {
  position: 'relative',
  paddingHorizontal: 8,
  paddingVertical: 8,
  borderRadius: 16,
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

const Message = (props: Props) => {
  const { text, images, reactions, reply, pinned } = props

  const [hovered, setHovered] = React.useState(false)
  const [actionsOpen, setActionsOpen] = React.useState(false)

  const active = actionsOpen || hovered
  // <Sheet press="long">

  const dispatch = useChatDispatch()

  return (
    <Wrapper
      active={active}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
    >
      {active && (
        <Unspaced>
          <Actions
            reactions={reactions}
            onOpenChange={setActionsOpen}
            onReplyPress={() => dispatch({ type: 'reply', messageId: '1' })}
            onEditPress={() => dispatch({ type: 'edit', messageId: '1' })}
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
          space={2}
        >
          <PinIcon color="$blue-50" />
          <Paragraph variant={11} weight="medium" color="$blue-50">
            Steve
          </Paragraph>
        </Stack>
      )}

      <XStack space={10}>
        <Avatar
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
            <Paragraph flexGrow={0} weight="regular" color="$neutral-100">
              {text}
            </Paragraph>
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

          {reactions && (
            <Stack paddingTop={8}>
              <Reactions reactions={reactions} />
            </Stack>
          )}
        </YStack>
      </XStack>
    </Wrapper>
  )
}

export { Message }
