import React, { useEffect, useRef } from 'react'

import { useChatState } from '~/src/contexts/chat-context'
import { CrossIcon } from '~/src/icons/cross-icon'
import { EmojiIcon } from '~/src/icons/emoji-icon'
import { GifIcon } from '~/src/icons/gif-icon'
import { ImageIcon } from '~/src/icons/image-icon'
import { ReplyIcon } from '~/src/icons/reply-icon'
import { StickerIcon } from '~/src/icons/sticker-icon'
import { styled } from '~/src/styles/config'
import { Icon, Image } from '~/src/system'
import { Flex } from '~/src/system/flex'
import { IconButton } from '~/src/system/icon-button'
import { Text } from '~/src/system/text'

import type { Message } from '~/src/contexts/chat-context'

interface Props {
  value?: string
}

export const ChatInput = (props: Props) => {
  const { value } = props
  const { state } = useChatState()

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (state.message) {
      inputRef.current?.focus()
    }
  }, [state.message])

  return (
    <Wrapper>
      <IconButton label="Add file">
        <ImageIcon />
      </IconButton>
      <Bubble>
        {state.message && <InputReply reply={state.message} />}

        <InputWrapper>
          <Input ref={inputRef} placeholder="Message" defaultValue={value} />
          <Flex>
            <IconButton label="Pick emoji">
              <EmojiIcon />
            </IconButton>
            <IconButton label="Pick sticker">
              <StickerIcon />
            </IconButton>
            <IconButton label="Pick gif">
              <GifIcon />
            </IconButton>
          </Flex>
        </InputWrapper>
      </Bubble>
    </Wrapper>
  )
}

interface InputReplyProps {
  reply: Message
}

const InputReply = ({ reply }: InputReplyProps) => {
  const { dispatch } = useChatState()
  return (
    <Reply>
      <Flex align="center" justify="between">
        <Flex gap={1}>
          <Icon hidden>
            <ReplyIcon />
          </Icon>
          <Text size="13" weight="500" truncate={false}>
            vitalik.eth
          </Text>
        </Flex>

        <IconButton
          label="Cancel reply"
          onClick={() => dispatch({ type: 'CANCEL_REPLY' })}
        >
          <CrossIcon />
        </IconButton>
      </Flex>
      {reply.type === 'text' && (
        <Flex>
          <Text size="13" truncate={false}>
            This a very very very very very very very very very very very very
            very very very very very very very very very very very very very
            very very very very long message that is going to be truncated.
          </Text>
        </Flex>
      )}
      {reply.type === 'image' && (
        <Image
          src="https://images.unsplash.com/photo-1647531041383-fe7103712f16?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80"
          width={56}
          height={56}
          fit="cover"
          radius="bubble"
          alt="message"
        />
      )}
    </Reply>
  )
}

const Wrapper = styled('div', {
  display: 'flex',
  overflow: 'hidden',
  alignItems: 'flex-end',
  padding: '12px 8px 12px 10px',
  gap: 4,
})

const Bubble = styled('div', {
  width: '100%',
  background: '#EEF2F5',
  borderRadius: '16px 16px 4px 16px;',
  padding: 2,
  overflow: 'hidden',
})

const InputWrapper = styled('div', {
  display: 'flex',
  height: 40,
  width: '100%',
  alignItems: 'center',
  background: '#EEF2F5',
  padding: '0 0 0 12px',
})

const Input = styled('input', {
  display: 'flex',
  background: 'none',
  alignItems: 'center',
  width: '100%',
})

const Reply = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  overflow: 'hidden',
  padding: '6px 12px',
  background: 'rgba(0, 0, 0, 0.1)',
  borderRadius: '14px 14px 4px 14px;',
})
