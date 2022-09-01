import React, { useState } from 'react'

import * as Tabs from '@radix-ui/react-tabs'
import { Link, useNavigate } from 'react-router-dom'

import { BellIcon } from '../../../../../../icons/bell-icon'
import { MarkAllAsReadIcon } from '../../../../../../icons/mark-all-as-read-icon'
import { TinyReplyIcon } from '../../../../../../icons/tiny-reply-icon'
import { useActivityCenter } from '../../../../../../protocol'
import { styled } from '../../../../../../styles/config'
import {
  Avatar,
  Box,
  Flex,
  IconButton,
  Popover,
  PopoverTrigger,
  Text,
} from '../../../../../../system'

export const ActivityCenter = () => {
  const [open, setOpen] = useState(false)

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

  const navigate = useNavigate()

  const renderNotifications = (notifications: Notification[]) => {
    return notifications.map(notification => {
      const value = notification.value
      const isReply = notification.isReply

      // todo: un/read
      // todo: date separator
      return (
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
              <Text style={{ wordBreak: 'break-word' }}>{value.text}</Text>
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
    })
  }

  return (
    //   {/* todo: mention component; add to design system */}
    <PopoverTrigger open={open} onOpenChange={setOpen}>
      <IconButton label="Show Activity Center" onClick={() => setOpen(!open)}>
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
            <Tabs.Content value="tab1">{renderNotifications(all)}</Tabs.Content>
            <Tabs.Content value="tab2">
              {renderNotifications(mentions)}
            </Tabs.Content>
            <Tabs.Content value="tab3">
              {renderNotifications(replies)}
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </Popover>
    </PopoverTrigger>
  )
}

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
