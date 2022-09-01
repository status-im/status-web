// todo: move from chat/components folder after merge

import React, { useState } from 'react'

import * as Tabs from '@radix-ui/react-tabs'
import { Link, useMatch, useNavigate } from 'react-router-dom'

// import { ChatMenu } from '../../../../components/chat-menu'
import { useAppState } from '../../../../contexts/app-context'
import { BellIcon } from '../../../../icons/bell-icon'
// import { DotsIcon } from '../../../../icons/dots-icon'
import { GroupIcon } from '../../../../icons/group-icon'
import { MarkAllAsReadIcon } from '../../../../icons/mark-all-as-read-icon'
import { TinyReplyIcon } from '../../../../icons/tiny-reply-icon'
import { useActivityCenter, useChat } from '../../../../protocol'
import { styled } from '../../../../styles/config'
import {
  Avatar,
  Box,
  Flex,
  IconButton,
  Popover,
  PopoverTrigger,
  Separator,
  Text,
} from '../../../../system'
import { ChatInfo } from '../chat-info'

// interface Props {
//   enableMembers: boolean
// }

export const Navbar = (/* props: Props */) => {
  // const { enableMembers } = props

  const { state, options, dispatch } = useAppState()
  const enableMembers = options.enableMembers ?? false // && (chat.type === 'group' || chat.type === 'channel')
  // const showMembers = enableMembers && state.showMembers

  const { params } = useMatch(':id')! // eslint-disable-line @typescript-eslint/no-non-null-assertion
  // const path = useMatch(':id')! // eslint-disable-line @typescript-eslint/no-non-null-assertion

  // fixme!:
  const chat = useChat(params.id!)
  // const chat = useChat(path?.params.id)
  const { activityCenter, notifications, totalCount } = useActivityCenter()

  const { all, mentions, replies } = notifications.reduce(
    (acc, obj) => {
      if (obj.type === 'message') {
        if (obj.isMention) {
          acc.mentions.push(obj)
        }

        if (obj.isReply) {
          acc.replies.push(obj)
        }
      }

      return acc
    },
    { all: notifications, mentions: [], replies: [] }
  )

  const [open, setOpen] = useState(false)

  const navigate = useNavigate()

  return (
    <NavbarWrapper>
      <ChatInfo chat={chat} />

      {/* <div>
      {chat && <ChatInfo chat={chat} />} */}

      <Flex gap="2" align="center">
        {chat && enableMembers && (
          <IconButton
            label="Toggle Members"
            active={state.showMembers}
            onClick={() => {
              console.log(state.showMembers)
              dispatch({ type: 'TOGGLE_MEMBERS' })
            }}
          >
            <GroupIcon />
          </IconButton>
        )}

        {/* <DropdownMenuTrigger>
          <IconButton label="Options">
            <DotsIcon />
          </IconButton>
          <ChatMenu type="dropdown" />
        </DropdownMenuTrigger> */}

        <Separator orientation="vertical" css={{ height: 24 }} />

        {/* todo: move to ActivityCenter component, then moved to reusable NavBar redering children */}
        {/* todo: tabs (switching), see radix */}
        {/* todo: mention component; add to design system */}
        <PopoverTrigger open={open} onOpenChange={setOpen}>
          <IconButton
            label="Show Activity Center"
            onClick={() => setOpen(!open)}
          >
            {/* todo?: use <div> */}
            <>
              <BellIcon />
              {totalCount > 0 && (
                <Badge style={{ position: 'relative' }}>
                  {totalCount < 99 ? totalCount : '∞'}
                </Badge>
              )}
            </>
          </IconButton>

          <Popover
            side="bottom"
            style={{
              maxWidth: '600px',
              minWidth: '600px',
              maxHeight: '770px',
              minHeight: '770px',
            }}
          >
            <Tabs.Root
              defaultValue="tab1"
              orientation="vertical"
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <Flex style={{ padding: '16px' }}>
                {/* todo: default tab */}
                {/* todo?: if all empty, disable other tabs */}
                <Tabs.List aria-label="tabs example">
                  <Tabs.Trigger
                    value="tab1"
                    style={{
                      padding: '0px 12px',
                    }}
                  >
                    All
                  </Tabs.Trigger>
                  <Tabs.Trigger value="tab2" style={{ padding: '0px 12px' }}>
                    Mentions
                  </Tabs.Trigger>
                  <Tabs.Trigger value="tab3" style={{ padding: '0px 12px' }}>
                    Replies
                  </Tabs.Trigger>
                </Tabs.List>
                {/* todo?: relative to currently selected tab */}
                <IconButton
                  label="Mark All As Read"
                  onClick={() => activityCenter.removeNotifications()}
                >
                  <MarkAllAsReadIcon />
                </IconButton>
              </Flex>
              {/* todo: if reply, show message being responded to as mention tag */}
              {/* todo: chat mention tag */}
              {/* todo: add message date separators */}
              <div
                style={{
                  maxHeight: '700px',
                  minHeight: '700px',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  WebkitOverflowScrolling: 'touch',
                  overscrollBehavior: 'contain',
                }}
              >
                <Tabs.Content
                  value="tab1"
                  // style={{
                  //   overflowY: 'auto',
                  //   overflowX: 'hidden',
                  //   WebkitOverflowScrolling: 'touch',
                  //   overscrollBehavior: 'contain',
                  // }}
                >
                  {/* <Text size="15" color="gray">
                  Today
                </Text> */}
                  {/* Notifications */}
                  {/* todo: jump to mesage in chat and flash it */}
                  {all.map(notification => {
                    const value = notification.value
                    const isReply = notification.isReply

                    return (
                      // Chat messages
                      <NotificationLink
                        to={`/${value.chatUuid}`}
                        key={value.messageId}
                        // todo?: rename to jumpedTo, navigateTo, goTo
                        state={{ selectedMesssageId: value.messageId }}
                        // style={{ background: 'red' }}
                        onClick={() => setOpen(false)}
                      >
                        <Flex gap={2}>
                          <Box>
                            <Avatar
                              size={40}
                              name={value.member.username}
                              colorHash={value.member.colorHash}
                            ></Avatar>
                          </Box>
                          <Box>
                            <Flex gap="1" align="center">
                              <Text color="primary" weight="500" size="15">
                                {value.member.username}
                              </Text>
                              <Text size="10" color="gray">
                                0x045…d71
                              </Text>
                              <Text size="10" color="gray">
                                •
                              </Text>
                              <Text size="10" color="gray">
                                9:41 AM
                              </Text>
                            </Flex>
                            <Text style={{ wordBreak: 'break-word' }}>
                              {value.text}
                            </Text>
                            {/* Community tag */}
                            <div
                              style={{
                                padding: '0px 6px',
                                border: '1px solid rgba(0, 0, 0, 0.1)',
                                borderRadius: '11px',
                                height: '22px',
                              }}
                            >
                              {'icon, avatar, '}
                              {'Community'}
                              {' icon '}
                              <PathLink
                                onClick={e => {
                                  // e.stopPropagation()
                                  e.preventDefault()
                                  navigate(`/${value.chatUuid}`)
                                }}
                              >
                                #chat
                              </PathLink>
                            </div>
                            {/* Reply tag */}
                            {isReply && (
                              <div
                                style={{
                                  padding: '0px 6px',
                                  border: '1px solid rgba(0, 0, 0, 0.1)',
                                  borderRadius: '11px',
                                  height: '22px',
                                }}
                              >
                                {/* <TinyReplyIcon /> */}
                                {value.responseToMessage?.text}
                              </div>
                            )}
                          </Box>
                        </Flex>
                      </NotificationLink>
                    )
                  })}
                </Tabs.Content>
                <Tabs.Content
                  value="tab2"
                  // style={{
                  //   overflowY: 'auto',
                  //   overflowX: 'hidden',
                  //   WebkitOverflowScrolling: 'touch',
                  //   overscrollBehavior: 'contain',
                  // }}
                >
                  {mentions.map(notification => {
                    const value = notification.value

                    return (
                      // Chat messages
                      <Flex key={value.messageId} gap={2}>
                        <Box>
                          <Avatar
                            size={40}
                            // name={value.member.username}
                            // colorHash={value.member.colorHash}
                          ></Avatar>
                        </Box>
                        <Box>
                          <Flex gap="1" align="center">
                            <Text color="primary" weight="500" size="15">
                              {value.displayName}
                            </Text>
                            <Text size="10" color="gray">
                              0x045…d71
                            </Text>
                            <Text size="10" color="gray">
                              •
                            </Text>
                            <Text size="10" color="gray">
                              9:41 AM
                            </Text>
                          </Flex>
                          <Text style={{ wordBreak: 'break-word' }}>
                            {value.text}
                          </Text>
                        </Box>
                      </Flex>
                    )
                  })}
                </Tabs.Content>
                <Tabs.Content
                  value="tab3"
                  // style={{
                  //   overflowY: 'auto',
                  //   overflowX: 'hidden',
                  //   WebkitOverflowScrolling: 'touch',
                  //   overscrollBehavior: 'contain',
                  // }}
                >
                  {replies.map(notification => {
                    const value = notification.value

                    return (
                      // Chat messages
                      <Flex key={value.messageId} gap={2}>
                        <Box>
                          <Avatar
                            size={40}
                            // name={value.member.username}
                            // colorHash={value.member.colorHash}
                          ></Avatar>
                        </Box>
                        <Box>
                          <Flex gap="1" align="center">
                            <Text color="primary" weight="500" size="15">
                              {value.displayName}
                            </Text>
                            <Text size="10" color="gray">
                              0x045…d71
                            </Text>
                            <Text size="10" color="gray">
                              •
                            </Text>
                            <Text size="10" color="gray">
                              9:41 AM
                            </Text>
                          </Flex>
                          <Text style={{ wordBreak: 'break-word' }}>
                            {value.text}
                          </Text>
                        </Box>
                      </Flex>
                    )
                  })}
                </Tabs.Content>
              </div>
            </Tabs.Root>
          </Popover>
        </PopoverTrigger>
      </Flex>
    </NavbarWrapper>
    // {/* </div> */}
  )
}

const NavbarWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 16px',
})

// todo: dedupe
// fixme: position, white border, stretch up to 2 digits
const Badge = styled('div', {
  textAlign: 'center',
  position: 'absolute',
  right: 8,
  width: 22,
  height: 22,
  background: '$primary-1',
  borderRadius: '$full',
  fontSize: 12,
  color: '$accent-11',

  border: '2px solid $accent-11',

  // 'line-height': '16px',
  // align: 'center',
  // display: 'flex',
  // 'flex-direction': 'column',
  // 'align-items': 'center',
  // padding: '1px 5px',
  // // position: 'absolute',
  // // left: '16px',
  // // top: '-2px',
})

const NotificationLink = styled(Link, {
  // width: '100%',
  // boxSizing: 'border-box',
  // display: 'inherit',
  display: 'inline-flex',
  // border: '1px solid black',
  '&:hover': {
    background: '$gray-3',
  },
})

const PathLink = styled('a', {
  '&:hover': {
    textDecoration: 'underline',
  },
})
