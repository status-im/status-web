import React, { useState } from 'react'

import { useMatch } from 'react-router-dom'

// import { UserProfileDialog } from '../../../../components/user-profile-dialog'
import { useChatContext } from '../../../../contexts/chat-context'
// import { BellIcon } from '../../../../icons/bell-icon'
// import { PinIcon } from '../../../../icons/pin-icon'
import { useProtocol } from '../../../../protocol'
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
  prevMessage?: Message
  selected?: boolean
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
  const { client, account } = useProtocol()
  const { params } = useMatch(':id')!

  const chatId = params.id!
  const { message, selected } = props

  const mention = false
  const pinned = false

  const { messageId, contentType, clock, reactions, signer, responseTo } =
    message

  // TODO: remove usage of 0x prefix
  const owner = '0x' + account?.publicKey === signer
  const chat = client.community.getChat(chatId)!

  const member = client.community.getMember(signer)!

  const [editing, setEditing] = useState(false)
  const [reacting, setReacting] = useState(false)

  const { dispatch } = useChatContext()

  // const userProfileDialog = useDialog(UserProfileDialog)

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

  const renderMessage = () => {
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
      case 'TEXT_PLAIN': {
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
      case 'EMOJI': {
        return (
          <Text css={{ fontSize: '3rem', lineHeight: 1.1, letterSpacing: -2 }}>
            {message.text}
          </Text>
        )
      }
      case 'IMAGE': {
        const blob = new Blob([message.image.payload], { type: 'image/jpeg' })

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

  return (
    <>
      {/* <ContextMenuTrigger> */}
      <Wrapper
        mention={mention}
        pinned={pinned}
        data-active={reacting}
        selected={selected}
      >
        {responseTo && <MessageReply messageId={responseTo} />}
        <Flex gap={2}>
          <Box>
            {/* <DropdownMenuTrigger>
                <button type="button"> */}
            <Avatar
              size={44}
              name={member!.username}
              colorHash={member!.colorHash}
            />
            {/* </button> */}
            {/* <DropdownMenu>
                  <Flex direction="column" align="center" gap="1">
                    <Avatar size="36" />
                    <Text>{member!.username}</Text>
                    <EmojiHash />
                  </Flex>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item
                    icon={<BellIcon />}
                    onSelect={() => userProfileDialog.open({ member })}
                  >
                    View Profile
                  </DropdownMenu.Item>
                  <DropdownMenu.Item icon={<BellIcon />}>
                    Send Message
                  </DropdownMenu.Item>
                  <DropdownMenu.Item icon={<BellIcon />}>
                    Verify Identity
                  </DropdownMenu.Item>
                  <DropdownMenu.Item icon={<BellIcon />}>
                    Send Contact Request
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item icon={<BellIcon />} danger>
                    Mark as Untrustworthy
                  </DropdownMenu.Item>
                </DropdownMenu>
              </DropdownMenuTrigger> */}
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
                {new Date(Number(clock)).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </Flex>

            {renderMessage()}

            <MessageReactions reactions={reactions} onClick={handleReaction} />
          </Box>
        </Flex>

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
      </Wrapper>
      {/* <ContextMenu>
          <ContextMenu.Item onSelect={handleReplyClick}>Reply</ContextMenu.Item>
          <ContextMenu.Item onSelect={handlePinClick}>Pin</ContextMenu.Item>
        </ContextMenu> */}
      {/* </ContextMenuTrigger> */}
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
  padding: '10px 16px',
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
    selected: {
      true: {
        '@motion': {
          animation: `${backgroundAnimation} 3s ease-out 0s`,
        },
      },
    },
  },

  compoundVariants: [],
})
