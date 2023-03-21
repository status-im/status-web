import { useState } from 'react'

import { PinIcon } from '@status-im/icons/20'
import { styled } from '@tamagui/core'
import { BlurView } from 'expo-blur'
import { Pressable, View } from 'react-native'

import { Banner } from '../banner'
import { Dialog } from '../dialog'
import { Message } from '../messages'
import { Heading } from '../typography'

import type { MessageProps } from '../messages'

type PinnedMessageProps = {
  messages: MessageProps[]
}

const Wrapper = styled(View, {
  position: 'relative',
  paddingHorizontal: 4,
  paddingVertical: 4,
  borderRadius: 16,
  alignItems: 'center',
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
          <Heading>Pinned Messages</Heading>
          {messages.map((message, i) => (
            <Message key={i} {...message} />
          ))}
        </Wrapper>
      </Dialog>
    </BlurView>
  ) : null
}
