import { useState } from 'react'

import { PinIcon } from '@status-im/icons/20'
import { styled } from '@tamagui/core'
import { BlurView } from 'expo-blur'
import { Pressable, View } from 'react-native'

import { Banner } from '../banner'
import { Button } from '../button'
import { ContextTag } from '../context-tag'
import { Dialog } from '../dialog'
import { Message } from '../messages'
import { Text } from '../text'

import type { MessageProps } from '../messages'

type PinnedMessageProps = {
  messages: MessageProps[]
}

const Wrapper = styled(View, {
  position: 'relative',
  paddingHorizontal: 16,
  paddingVertical: 16,
  borderRadius: 16,
  alignSelf: 'center',
  alignItems: 'flex-start',
  maxWidth: 480,
  backgroundColor: '$neutral-5',

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

const DialogHeader = styled(View, {
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  paddingVertical: 16,
  space: 11,
})

const DialogContent = styled(View, {
  alignItems: 'stretch',
  justifyContent: 'flex-start',
})

export const PinnedMessage = ({ messages }: PinnedMessageProps) => {
  const [isDetailVisible, setIsDetailVisible] = useState(false)
  return messages.length > 0 ? (
    <BlurView intensity={40} style={{ zIndex: 100 }}>
      <Dialog open={isDetailVisible}>
        <Pressable onPress={() => setIsDetailVisible(true)}>
          <Banner count={messages.length} icon={<PinIcon />}>
            {messages[0].text}
          </Banner>
        </Pressable>

        <Wrapper>
          <Button variant="grey" onPress={() => setIsDetailVisible(false)}>
            &times;
          </Button>
          <DialogHeader>
            <Text size={27} weight="semibold">
              Pinned Messages
            </Text>
            <ContextTag icon="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images">
              Rarible &rsaquo; # random
            </ContextTag>
          </DialogHeader>
          <DialogContent>
            {messages.map((message, i) => (
              <Message key={i} {...message} />
            ))}
          </DialogContent>
        </Wrapper>
      </Dialog>
    </BlurView>
  ) : null
}
