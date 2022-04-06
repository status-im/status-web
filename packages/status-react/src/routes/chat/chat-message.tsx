import React from 'react'

import { useChatState } from '~/src/contexts/chat-context'
import { BellIcon } from '~/src/icons/bell-icon'
import { PencilIcon } from '~/src/icons/pencil-icon'
import { PinIcon } from '~/src/icons/pin-icon'
import { ReactionIcon } from '~/src/icons/reaction-icon'
import { ReplyIcon } from '~/src/icons/reply-icon'
import { TrashIcon } from '~/src/icons/trash-icon'
import { styled } from '~/src/styles/config'
import { AlertDialog, AlertDialogTrigger, Box } from '~/src/system'
import { Avatar } from '~/src/system/avatar'
import { ContextMenu, ContextMenuTrigger } from '~/src/system/context-menu'
import { DropdownMenu, DropdownMenuTrigger } from '~/src/system/dropdown-menu'
import { Flex } from '~/src/system/flex'
import { IconButton } from '~/src/system/icon-button'
import { Image } from '~/src/system/image'
import { Text } from '~/src/system/text'
import { Tooltip } from '~/src/system/tooltip'

interface Props {
  reply?: 'text' | 'image' | 'image-text'
  image?: boolean
  mention?: boolean
  pinned?: boolean
}

const MessageLink = (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const { onClick } = props

  return (
    <a
      {...props}
      href="https://specs.status.im/spec/"
      onClick={e => {
        onClick?.(e)
        e.preventDefault()
      }}
    >
      https://specs.status.im/spec/
    </a>
  )
}

export const ChatMessage = (props: Props) => {
  const { reply, image, mention, pinned } = props

  const { dispatch } = useChatState()

  return (
    <>
      {reply && <MessageReply reply={reply} />}
      <ContextMenuTrigger>
        <Wrapper mention={mention} pinned={pinned}>
          <div>
            <DropdownMenuTrigger>
              <button type="button">
                <Avatar size={44} />
              </button>
              <DropdownMenu>
                <div>
                  <Avatar size={36} />
                  <Text>simon.eth</Text>
                </div>
                <DropdownMenu.Separator />
                <DropdownMenu.Item icon={<BellIcon />}>
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
          </div>

          <div style={{ flex: 1 }}>
            <Flex>
              <Text color="primary" weight="500">
                carmen
              </Text>
              <Text size="10" color="gray">
                10:00
              </Text>
            </Flex>

            <Text>
              My first hoya{' '}
              <AlertDialogTrigger>
                <MessageLink href="https://specs.status.im/spec">
                  https://specs.status.im/spec
                </MessageLink>
                <AlertDialog
                  title="Are you sure you want to visit this website?"
                  description="https://specs.status.im/spec"
                  actionLabel="Yes, take me there"
                />
              </AlertDialogTrigger>{' '}
              bloom has started to develop alongside my first aphid issue 😩
            </Text>

            {image && (
              <Flex gap={1} css={{ paddingTop: '$1' }}>
                <Image
                  width={147}
                  alt="message"
                  height={196}
                  src="https://images.unsplash.com/photo-1648492678772-8b52fe36cebc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3570&q=80"
                  radius="bubble"
                />
              </Flex>
            )}
          </div>

          <Actions>
            <Tooltip label="React">
              <IconButton label="Pick reaction" intent="info" color="gray">
                <ReactionIcon />
              </IconButton>
            </Tooltip>
            <Tooltip label="Reply">
              <IconButton
                label="Reply to message"
                intent="info"
                color="gray"
                onClick={() =>
                  dispatch({
                    type: 'SET_REPLY',
                    message: {
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      type: reply!,
                      text: 'bloom has started to develop alongside my first aphid issue 😩',
                    },
                  })
                }
              >
                <ReplyIcon />
              </IconButton>
            </Tooltip>
            <Tooltip label="Edit">
              <IconButton label="Edit message" intent="info" color="gray">
                <PencilIcon />
              </IconButton>
            </Tooltip>
            {pinned ? (
              <Tooltip label="Unpin">
                <IconButton label="Unpin message" intent="info" color="gray">
                  <UnpinIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip label="Pin">
                <IconButton label="Pin message" intent="info" color="gray">
                  <PinIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip label="Delete">
              <IconButton label="Delete message" intent="danger" color="gray">
                <TrashIcon />
              </IconButton>
            </Tooltip>
          </Actions>
        </Wrapper>
        <ContextMenu>
          <ContextMenu.Item>Reply</ContextMenu.Item>
          <ContextMenu.Item>Pin</ContextMenu.Item>
        </ContextMenu>
      </ContextMenuTrigger>
    </>
  )
}

const MessageReply = ({
  reply,
}: {
  reply: 'text' | 'image' | 'image-text'
}) => {
  return (
    <Reply>
      <Flex gap="1" align="center">
        <Avatar size={20} />
        <Text color="gray" size="13" weight="500">
          vitalik.eth
        </Text>
      </Flex>
      {reply === 'text' && (
        <Flex>
          <Text color="gray" size="13" truncate={false}>
            This a very very very very very very very very very very very very
            very very very very very very very very very very very very very
            very very very very long message that is going to be truncated.
          </Text>
        </Flex>
      )}
      {reply === 'image' && (
        <Image
          src="https://images.unsplash.com/photo-1647531041383-fe7103712f16?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80"
          width={56}
          height={56}
          fit="cover"
          radius="1"
          alt="message"
        />
      )}
      {reply === 'image-text' && (
        <Box>
          <Text color="gray" size="13" truncate={false}>
            This a very very very very very very very very very very very very
            very very very very very very very very very very very very very
            very very very very long message that is going to be truncated.
          </Text>
          <Image
            src="https://images.unsplash.com/photo-1647531041383-fe7103712f16?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80"
            width={56}
            height={56}
            fit="cover"
            radius="1"
            alt="message"
          />
        </Box>
      )}
    </Reply>
  )
}

const Wrapper = styled('div', {
  position: 'relative',
  padding: '10px 16px',
  display: 'flex',
  gap: '$2',

  transitionProperty: 'background-color, border-color, color, fill, stroke',
  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  transitionDuration: '100ms',

  '&:hover, &[data-open="true"]': {
    background: '#EEF2F5',
    // [`& ${Actions}`]: {
    //   marginLeft: '5px',
    // },
  },

  a: {
    textDecoration: 'underline',
  },

  variants: {
    mention: {
      true: {
        background: '$mention-4',

        '&:hover, &[data-open="true"]': {
          background: '$mention-3',
          // [`& ${Actions}`]: {
          //   marginLeft: '5px',
          // },
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

        '&:hover, &[data-open="true"]': {
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
})

const Reply = styled('div', {
  position: 'relative',
  // height: 40,
  marginLeft: 68,
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',

  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    '--background-accent': 'rgba(147, 155, 161, 0.4)',
    '--avatar-size': '44px',
    '--gutter': '8px',
    '--width': '2px',
  },

  '&::before': {
    display: 'block',
    position: 'absolute',
    top: 10,
    right: 'calc(100% + 10px)',
    bottom: '0',
    left: 'calc(var(--avatar-size)/2*-1 + var(--gutter)*-1)',
    marginRight: 'var(--reply-spacing)',
    marginTop: 'calc(var(--width)*-1/2)',
    marginLeft: 'calc(var(--width)*-1/2)',
    marginBottom: 'calc(0.125rem - 4px)',
    borderLeft: 'var(--width) solid var(--background-accent)',
    borderBottom: '0 solid var(--background-accent)',
    borderRight: '0 solid var(--background-accent)',
    borderTop: 'var(--width) solid var(--background-accent)',
    borderTopLeftRadius: '10px',
  },
})

const Actions = styled('div', {
  position: 'absolute',
  top: -18,
  right: 16,
  padding: 2,
  boxShadow: '0px 4px 12px rgba(0, 34, 51, 0.08)',
  background: '#fff',
  borderRadius: 8,
  display: 'none',

  ':hover > &': {
    display: 'flex',
  },
})
