import React, { useState } from 'react'

import { useMatch } from 'react-router-dom'

// import { UserProfileDialog } from '../../../../components/user-profile-dialog'
import { useChatContext } from '../../../../contexts/chat-context'
// import { BellIcon } from '../../../../icons/bell-icon'
// import { PinIcon } from '../../../../icons/pin-icon'
import {
  MessageContentType,
  useAccount,
  useProtocol,
} from '../../../../protocol'
import { keyframes, styled } from '../../../../styles/config'
import {
  Avatar,
  Box,
  Button,
  // ContextMenu,
  // ContextMenuTrigger,
  // DropdownMenu,
  // DropdownMenuTrigger,
  // EmojiHash,
  Flex,
  Image,
  Text,
  // useDialog,
} from '../../../../system'
import { ChatInput } from '../chat-input'
import { Actions } from './actions'
import { MessageReply } from './message-reply'
import { MessageReactions } from './reactions'

import type { Message, Reaction } from '../../../../protocol'

interface Props {
  message: Message
  collapse: boolean
  highlight?: boolean
}

// const MessageLink = forwardRef(function MessageLink(
//   props: React.AnchorHTMLAttributes<HTMLAnchorElement>,
//   ref: Ref<HTMLAnchorElement>
// ) {
//   const { onClick } = props

//   return (
//     <a
//       {...props}
//       ref={ref}
//       href="https://specs.status.im/spec/"
//       onClick={e => {
//         onClick?.(e)
//         e.preventDefault()
//       }}
//     >
//       https://specs.status.im/spec/
//     </a>
//   )
// })

export const ChatMessage = (props: Props) => {
  const { message, collapse, highlight } = props

  const { client, account } = useProtocol()
  const { isMember } = useAccount()
  const { params } = useMatch(':id')!

  const chatId = params.id!

  const mention = false
  const pinned = false

  const { messageId, contentType, timestamp, reactions, signer, responseTo } =
    message

  // TODO: remove usage of 0x prefix
  const owner = '0x' + account?.publicKey === signer
  const chat = client.community.getChat(chatId)!

  const member = client.community.getMember(signer)!
  const response = client.community.getChat(params.id!)!.getMessage(responseTo)

  const [editing, setEditing] = useState(false)
  const [reacting, setReacting] = useState(false)

  const { dispatch } = useChatContext()

  // const userProfileDialog = useDialog(UserProfileDialog)

  // TODO: fix saving of edited message
  const handleMessageSubmit = (message: string) => {
    chat.sendTextMessage(message)
  }

  const handleMessageEdit = (message: string) => {
    chat.editMessage(messageId, message)
    setEditing(false)
  }

  const handleMessageDelete = () => {
    chat.deleteMessage(messageId)
  }

  const handleReaction = (reaction: Reaction) => {
    chat.sendReaction(messageId, reaction)
  }

  const handleReplyClick = () => {
    dispatch({ type: 'SET_REPLY', message, member })
  }

  const handlePinClick = () => {
    // TODO: pin message
  }

  const renderContent = () => {
    if (editing) {
      return (
        <Box>
          <ChatInput value={message?.text ?? ''} onSubmit={handleMessageEdit} />
          <Flex gap={2}>
            <Button
              variant="outline"
              size="small"
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
            {/* TODO: fix message submit */}
            <Button size="small" onClick={() => handleMessageSubmit('')}>
              Save
            </Button>
          </Flex>
        </Box>
      )
    }

    switch (contentType) {
      case MessageContentType.TEXT_PLAIN: {
        //   <AlertDialogTrigger>
        //   <MessageLink href="https://specs.status.im/spec">
        //     https://specs.status.im/spec
        //   </MessageLink>
        //   <AlertDialog
        //     title="Are you sure you want to visit this website?"
        //     description="https://specs.status.im/spec"
        //     actionLabel="Yes, take me there"
        //   />
        // </AlertDialogTrigger>{' '}
        return <Text>{message.text}</Text>
      }
      case MessageContentType.EMOJI: {
        return (
          <Text css={{ fontSize: '3rem', lineHeight: 1.1, letterSpacing: -2 }}>
            {message.text}
          </Text>
        )
      }
      case MessageContentType.IMAGE: {
        // fixme?
        const image = message.payload.value as {
          payload: Uint8Array
          type: number
        }
        const blob = new Blob([image.payload], {
          type: 'image/jpeg',
        })

        // TODO?: call URL.revokeObjectURL()
        return (
          <Flex gap={1} css={{ paddingTop: '$2' }}>
            <Image
              width={150}
              alt="message"
              height={150}
              src={URL.createObjectURL(blob)}
              radius="bubble"
              fit="cover"
            />
          </Flex>
        )
      }
    }
  }

  const renderMessage = () => {
    if (collapse) {
      return (
        <Box css={{ flex: 1, paddingLeft: 52 }}>
          {renderContent()}
          <MessageReactions reactions={reactions} onClick={handleReaction} />
        </Box>
      )
    }

    return (
      <Flex gap={2}>
        <Box>
          <Avatar
            size={40}
            name={member!.username}
            colorHash={owner ? undefined : member!.colorHash}
          />
        </Box>

        <Box css={{ flex: 1 }}>
          {/* {pinned && (
        </Box>

        <Box css={{ flex: 1 }}>
          {/* {pinned && (
                <Flex gap={1}>
                  <PinIcon width={8} />
                  <Text size="13">Pinned by {contact.name}</Text>
                </Flex>
              )} */}

          <Flex gap="1" align="center">
            <Text color="primary" weight="500" size="15">
              {member!.username}
            </Text>
            <Text size="10" color="gray">
              {new Date(Number(timestamp)).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </Flex>

          {renderContent()}

          <MessageReactions reactions={reactions} onClick={handleReaction} />
        </Box>
      </Flex>
    )
  }

  return (
    <>
      {/* <ContextMenuTrigger> */}
      <Wrapper
        mention={mention}
        pinned={pinned}
        highlight={highlight}
        data-active={reacting}
      >
        {response && <MessageReply message={response} />}
        {renderMessage()}

        {isMember && (
          <Actions
            owner={owner}
            pinned={pinned}
            onEditClick={() => setEditing(true)}
            onReplyClick={handleReplyClick}
            onPinClick={handlePinClick}
            onDeleteClick={handleMessageDelete}
            onReactionClick={handleReaction}
            reacting={reacting}
            onReactingChange={setReacting}
            reactions={reactions}
          />
        )}
      </Wrapper>
    </>
  )
}

const backgroundAnimation = keyframes({
  from: {
    backgroundColor: '$navigate-2',
  },
  to: {
    backgroundColor: 'revert',
  },
})

// TODO: Use compound variants https://stitches.dev/docs/variants#compound-variants
const Wrapper = styled('div', {
  position: 'relative',
  padding: '8px 16px',
  marginTop: 2,
  gap: '$2',

  transitionProperty: 'background-color, border-color, color, fill, stroke',
  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  transitionDuration: '100ms',

  '&:hover, &[data-open="true"], &[data-active="true"]': {
    background: '$gray-2',
  },

  a: {
    textDecoration: 'underline',
  },

  variants: {
    mention: {
      true: {
        background: '$mention-4',
        '&:hover, &[data-open="true"], &[data-active="true"]': {
          background: '$mention-3',
        },

        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: 3,
          background: '$mention-1',
        },
      },
    },
    pinned: {
      true: {
        background: '$pin-3',
        '&:hover, &[data-open="true"], &[data-active="true"]': {
          background: '$pin-2',
        },

        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: 3,
          background: '$pin-1',
        },
      },
    },
    highlight: {
      true: {
        '@motion': {
          animation: `${backgroundAnimation} 3s ease-out 0s`,
        },
      },
    },
  },

  compoundVariants: [],
})
