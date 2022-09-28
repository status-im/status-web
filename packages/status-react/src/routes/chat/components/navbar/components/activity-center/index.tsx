import React, { Fragment, useState } from 'react'

import * as Tabs from '@radix-ui/react-tabs'
import format from 'date-fns/format'
import isSameDay from 'date-fns/isSameDay'
import isSameYear from 'date-fns/isSameYear'

import { BellIcon } from '../../../../../../icons/bell-icon'
import { MarkAllAsReadIcon } from '../../../../../../icons/mark-all-as-read-icon'
import { useActivityCenter } from '../../../../../../protocol'
import {
  Activity,
  Badge,
  Button,
  Flex,
  IconButton,
  Popover,
  PopoverTrigger,
  Text,
  Tooltip,
} from '../../../../../../system'

import type { Notification } from '@status-im/js'

export const ActivityCenter = () => {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

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

  const renderNotifications = (notifications: Notification[]) => {
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
                style={{ height: '34px', padding: '8px 16px 4px 16px' }}
              >
                {date}
              </Text>
            )}
            <Activity close={() => setOpen(false)}>
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
          style={{
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
        <IconButton label="Show Activity Center" onClick={() => setOpen(!open)}>
          <div style={{ position: 'relative' }}>
            <BellIcon />
            {totalCount > 0 && (
              <Badge
                variant="border"
                css={{
                  position: 'absolute',
                  left: 8,
                  top: -8,
                }}
              >
                {totalCount}
              </Badge>
            )}
          </div>
        </IconButton>
      </Tooltip>
      <Popover side="bottom">
        <div
          style={{
            width: '600px',
            height: '770px',
          }}
        >
          <Tabs.Root
            value={activeTab}
            onValueChange={setActiveTab}
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <Flex
              style={{
                height: '64px',
                padding: '13px 16px',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {/* todo: default tab */}
              {/* todo?: if all empty, disable other tabs */}
              {/* todo?: if active, disable hover and clicks */}
              <Tabs.List
                aria-label="tabs example"
                style={{ display: 'flex', gap: '8px' }}
              >
                {/* todo: map */}
                <Tabs.Trigger value="all" asChild>
                  <Button size="small" variant="secondary">
                    All
                  </Button>
                </Tabs.Trigger>
                <Tabs.Trigger value="mentions" asChild>
                  <Button size="small" variant="secondary">
                    Mentions
                  </Button>
                </Tabs.Trigger>
                <Tabs.Trigger value="replies" asChild>
                  <Button size="small" variant="secondary">
                    Replies
                  </Button>
                </Tabs.Trigger>
              </Tabs.List>
              <div>
                {/* todo: call it "Mark as Read" since the action is relative to active tab */}
                <Tooltip label="Mark all as Read" arrowOffset={7}>
                  <IconButton
                    label="Mark All As Read"
                    onClick={() =>
                      activityCenter.removeNotifications(activeTab)
                    }
                  >
                    <MarkAllAsReadIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </Flex>
            <div
              style={{
                flex: 1,
                overflow: 'hidden',
                overflowY: 'scroll',
              }}
            >
              <Tabs.Content
                className="content"
                value="all"
                style={{
                  width: '100%',
                  height: '100%',
                }}
              >
                {renderNotifications(all)}
              </Tabs.Content>
              <Tabs.Content
                value="mentions"
                style={{
                  width: '100%',
                  height: '100%',
                }}
              >
                {renderNotifications(mentions)}
              </Tabs.Content>
              <Tabs.Content
                value="replies"
                style={{
                  width: '100%',
                  height: '100%',
                }}
              >
                {renderNotifications(replies)}
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </div>
      </Popover>
    </PopoverTrigger>
  )
}
