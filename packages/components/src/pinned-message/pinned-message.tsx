import { CloseIcon, PinIcon } from '@status-im/icons/20'
import { Stack } from '@tamagui/core'
import { Pressable } from 'react-native'

import { Banner } from '../banner'
import { Button } from '../button'
import { ContextTag } from '../context-tag'
import { Close, Dialog } from '../dialog'
import { Message } from '../messages'
import { Text } from '../text'

import type { MessageProps } from '../messages'

type Props = {
  messages: MessageProps[]
}

const PinnedMessage = (props: Props) => {
  const { messages } = props

  return (
    <Dialog>
      <Pressable>
        <Banner count={messages.length} icon={<PinIcon />}>
          {messages[0].text}
        </Banner>
      </Pressable>

      <Dialog.Content width={480} borderRadius={16}>
        <Stack padding={16} alignItems="flex-start">
          <Close asChild>
            <Button variant="grey" size={32} icon={<CloseIcon />} />
          </Close>
          <Stack paddingTop={24} gap={8} alignItems="flex-start">
            <Text size={27} weight="semibold">
              Pinned Messages
            </Text>
            <ContextTag
              src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images"
              label={['Rarible', '# random']}
            />
          </Stack>
        </Stack>
        <Stack padding={8}>
          {messages.map(message => (
            <Message key={message.id} {...message} pinned={false} />
          ))}
        </Stack>
      </Dialog.Content>
    </Dialog>
  )
}

export { PinnedMessage }
export type { Props as PinnedMessageProps }
