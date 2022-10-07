import React, { Fragment, useState } from 'react'

import format from 'date-fns/format'
import isSameDay from 'date-fns/isSameDay'
import isSameYear from 'date-fns/isSameYear'

import { BellIcon } from '../../../../../../icons/bell-icon'
import { DoubleTickIcon } from '../../../../../../icons/double-tick-icon'
import { useActivityCenter } from '../../../../../../protocol'
import {
  Activity,
  Badge,
  IconButton,
  Popover,
  PopoverTrigger,
  Tabs,
  Text,
  Tooltip,
} from '../../../../../../system'

import type { Notification } from '@status-im/js'

export const ActivityCenterPopover = () => {
  const [open, setOpen] = useState(false)

  const { activityCenter, notifications, totalCount } = useActivityCenter()

  const initialValue: {
    all: Notification[]
    mentions: Notification[]
    replies: Notification[]
  } = {
    all: notifications,
    mentions: [],
    replies: [],
  }
  const { all, mentions, replies } = notifications.reduce((acc, obj) => {
    if (obj.type === 'message') {
      if (obj.isMention) {
        acc.mentions.push(obj)
      }

      if (obj.isReply) {
        acc.replies.push(obj)
      }
    }

    return acc
  }, initialValue)

  const createContent = (
    notifications: Notification[]
  ): JSX.Element | JSX.Element[] => {
    const mappedNotifications = notifications.map(
      (currentNotification, notificationIndex, iteratedNotifications) => {
        const previousNotification =
          iteratedNotifications[notificationIndex - 1]

        let showNewDateSeparator: boolean
        if (!previousNotification) {
          showNewDateSeparator = true
        } else {
          showNewDateSeparator = !isSameDay(
            new Date(Number(currentNotification.value.timestamp)),
            new Date(Number(previousNotification.value.timestamp))
          )
        }

        let date: string | undefined
        if (showNewDateSeparator) {
          const _date = new Date(Number(currentNotification.value.timestamp))

          const today = new Date()
          const yesterday = new Date().setDate(today.getDate() - 1)

          if (isSameDay(_date, today)) {
            date = 'Today'
          } else if (isSameDay(_date, yesterday)) {
            date = 'Yesterday'
          } else if (isSameYear(_date, today)) {
            date = format(_date, 'iii, d MMMM')
          } else {
            date = format(_date, 'iii, d MMMM yyyy')
          }
        }

        return (
          <Fragment key={currentNotification.value.messageId}>
            {/* todo: seperate separator component */}
            {showNewDateSeparator && (
              <Text
                color="gray"
                weight={400}
                css={{ height: '34px', padding: '8px 16px 4px 16px' }}
              >
                {date}
              </Text>
            )}
            <Activity onNavigateChange={() => setOpen(false)}>
              {currentNotification}
            </Activity>
          </Fragment>
        )
      }
    )

    if (!mappedNotifications.length) {
      return (
        <Text
          size="15"
          color="gray"
          weight="400"
          align="center"
          css={{
            margin: 'auto',
            position: 'relative',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          Notifications will appear here
        </Text>
      )
    }

    return mappedNotifications
  }

  return (
    <PopoverTrigger open={open} onOpenChange={setOpen}>
      <Tooltip label="Activity">
        <IconButton
          label="Show Activity Center"
          onClick={() => setOpen(!open)}
          css={{ position: 'relative' }}
        >
          <>
            <BellIcon />
            {totalCount > 0 && (
              <Badge
                variant="border"
                css={{
                  position: 'absolute',
                  left: 16,
                  top: -2,
                }}
              >
                {totalCount}
              </Badge>
            )}
          </>
        </IconButton>
      </Tooltip>
      <Popover side="bottom" css={{ width: 600, height: 770 }}>
        <Tabs
          tabs={[
            { title: 'All', value: 'all', content: createContent(all) },
            {
              title: 'Mentions',
              value: 'mentions',
              content: createContent(mentions),
            },
            {
              title: 'Replies',
              value: 'replies',
              content: createContent(replies),
            },
          ]}
          actions={[
            {
              icon: <DoubleTickIcon />,
              // todo: call it "Mark as Read" since the action is relative to active tab
              label: 'Mark All As Read',
              method: (activeTab: string) =>
                activityCenter.removeNotifications(
                  activeTab as 'all' | 'mentions' | 'replies'
                ),
            },
          ]}
        />
      </Popover>
    </PopoverTrigger>
  )
}
