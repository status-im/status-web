import React, { useState } from 'react'

import { UserProfileDialog } from '~/src/components/user-profile-dialog'
import { useChatContext } from '~/src/contexts/chat-context'
import { BellIcon } from '~/src/icons/bell-icon'
import { PinIcon } from '~/src/icons/pin-icon'
import { styled } from '~/src/styles/config'
import {
  Avatar,
  Box,
  Button,
  ContextMenu,
  ContextMenuTrigger,
  DropdownMenu,
  DropdownMenuTrigger,
  EmojiHash,
  Flex,
  Image,
  Text,
  useDialog,
} from '~/src/system'

import { ChatInput } from '../chat-input'
import { Actions } from './actions'
import { MessageReply } from './message-reply'
import { MessageReactions } from './reactions'

import type { Message } from '~/src/protocol/use-messages'

interface Props {
  message: Message
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
  const { message } = props

  const { type, contact, owner, mention, pinned, reply, reactions } = message

  const [editing, setEditing] = useState(false)
  const [reacting, setReacting] = useState(false)

  const { dispatch } = useChatContext()

  const userProfileDialog = useDialog(UserProfileDialog)

  const handleReplyClick = () => {
    dispatch({
      type: 'SET_REPLY',
      message,
    })
  }

  const handlePinClick = () => {
    console.log(pinned)
  }

  const handleReaction = (reaction: string) => {
    console.log(reaction)
  }

  const renderMessage = () => {
    if (editing) {
      return (
        <Box>
          <ChatInput value={message?.text ?? ''} />
          <Flex gap={2}>
            <Button
              variant="outline"
              size="small"
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
            <Button size="small">Save</Button>
          </Flex>
        </Box>
      )
    }

    switch (type) {
      case 'text': {
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
      case 'image': {
        return (
          <Flex gap={1} css={{ paddingTop: '$2' }}>
            <Image
              width={147}
              alt="message"
              height={196}
              src={message.imageUrl}
              radius="bubble"
            />
          </Flex>
        )
      }
      case 'image-text': {
        const { text, imageUrl } = message

        return (
          <>
            <Text>{text}</Text>
            <Flex gap={1} css={{ paddingTop: '$1' }}>
              <Image
                width={147}
                alt="message"
                height={196}
                src={imageUrl}
                radius="bubble"
              />
            </Flex>
          </>
        )
      }
    }
  }

  return (
    <>
      <ContextMenuTrigger>
        <Wrapper mention={mention} pinned={pinned} data-active={reacting}>
          {reply && <MessageReply reply={reply} />}
          <Flex gap={2}>
            <Box>
              <DropdownMenuTrigger>
                <button type="button">
                  <Avatar size={44} src={contact.imageUrl} />
                </button>
                <DropdownMenu>
                  <Flex direction="column" align="center" gap="1">
                    <Avatar size="36" src={contact.imageUrl} />
                    <Text>{contact.name}</Text>
                    <EmojiHash />
                  </Flex>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item
                    icon={<BellIcon />}
                    onSelect={() =>
                      userProfileDialog.open({ name: contact.name })
                    }
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
              </DropdownMenuTrigger>
            </Box>

            <Box css={{ flex: 1 }}>
              {pinned && (
                <Flex gap={1}>
                  <PinIcon width={8} />
                  <Text size="13">Pinned by carmen.eth</Text>
                </Flex>
              )}

              <Flex gap="1" align="center">
                <Text color="primary" weight="500" size="15">
                  {contact.name}
                </Text>
                <Text size="10" color="gray">
                  10:00 AM
                </Text>
              </Flex>

              {renderMessage()}

              <MessageReactions
                reactions={reactions}
                onClick={handleReaction}
              />
            </Box>
          </Flex>

          <Actions
            owner={owner}
            pinned={pinned}
            onEditClick={() => setEditing(true)}
            onReplyClick={handleReplyClick}
            onPinClick={handlePinClick}
            reacting={reacting}
            onReactingChange={setReacting}
            reactions={reactions}
          />
        </Wrapper>
        <ContextMenu>
          <ContextMenu.Item onSelect={handleReplyClick}>Reply</ContextMenu.Item>
          <ContextMenu.Item onSelect={handlePinClick}>Pin</ContextMenu.Item>
        </ContextMenu>
      </ContextMenuTrigger>
    </>
  )
}

// TODO: Use compound variants https://stitches.dev/docs/variants#compound-variants
const Wrapper = styled('div', {
  position: 'relative',
  padding: '10px 16px',
  gap: '$2',

  transitionProperty: 'background-color, border-color, color, fill, stroke',
  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  transitionDuration: '100ms',

  '&:hover, &[data-open="true"], &[data-active="true"]': {
    background: '$gray-4',
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
  },

  compoundVariants: [],
})
