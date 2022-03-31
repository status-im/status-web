import React from 'react'

import { useMatch } from 'react-router-dom'

import { useAppState } from '~/src/contexts/app-context'
import { BellIcon } from '~/src/icons/bell-icon'
import { DotsIcon } from '~/src/icons/dots-icon'
import { GroupIcon } from '~/src/icons/group-icon'
import { styled } from '~/src/styles/config'
import { Separator } from '~/src/system'
import { Avatar } from '~/src/system/avatar'
import { DropdownMenu, DropdownMenuTrigger } from '~/src/system/dropdown-menu'
import { Flex } from '~/src/system/flex'
import { IconButton } from '~/src/system/icon-button'
import { Text } from '~/src/system/text'

interface Props {
  enableMembers: boolean
}

const chats: Record<string, { type: 'channel' | 'group-chat' | 'chat' }> = {
  welcome: { type: 'channel' },
  general: { type: 'channel' },
  random: { type: 'channel' },
  'vitalik.eth': { type: 'chat' },
  'pvl.eth': { type: 'chat' },
  'Climate Change': { type: 'group-chat' },
}

export const Navbar = (props: Props) => {
  const { enableMembers } = props

  const { state, dispatch } = useAppState()
  const { params } = useMatch(':id')! // eslint-disable-line @typescript-eslint/no-non-null-assertion

  const chat = chats[params.id!]

  const renderIdentity = () => {
    if (chat.type == 'channel') {
      return (
        <Flex align="center" gap="2">
          <Avatar size={36} />
          <div>
            <Text>#general</Text>
            <Text size={12} color="gray">
              2 pinned messages | General discussions about CryptoKitties.
            </Text>
          </div>
        </Flex>
      )
    }

    if (chat.type == 'group-chat') {
      return (
        <Flex align="center" gap="2">
          <Avatar size={36} />
          <div>
            <Text>Climate Change</Text>
            <Text size={12} color="gray">
              3 pinned messages | 5 members
            </Text>
          </div>
        </Flex>
      )
    }

    return (
      <Flex align="center" gap="2">
        <Avatar size={36} />
        <div>
          <Text>pvl.eth</Text>
          <Text size={12} color="gray">
            0x63FaC9201494f0bd17B9892B9fae4d52fe3BD377
          </Text>
        </div>
      </Flex>
    )
  }

  const renderMenuItems = () => {
    if (chat.type === 'channel') {
      return (
        <>
          <DropdownMenu.TriggerItem label="Mute Channel" icon={<BellIcon />}>
            <DropdownMenu.Item>For 15 min</DropdownMenu.Item>
            <DropdownMenu.Item>For 1 hour</DropdownMenu.Item>
            <DropdownMenu.Item>For 8 hours</DropdownMenu.Item>
            <DropdownMenu.Item>For 24 hours</DropdownMenu.Item>
            <DropdownMenu.Item>Until I turn it back on</DropdownMenu.Item>
          </DropdownMenu.TriggerItem>
          <DropdownMenu.Item icon={<BellIcon />}>
            Mark as Read
          </DropdownMenu.Item>
        </>
      )
    }
    return (
      <>
        {chat.type === 'chat' && (
          <DropdownMenu.Item icon={<BellIcon />}>
            View Profile
          </DropdownMenu.Item>
        )}
        {chat.type === 'group-chat' && (
          <DropdownMenu.Item icon={<BellIcon />}>Edit Group</DropdownMenu.Item>
        )}
        <DropdownMenu.Separator />
        {chat.type === 'group-chat' && (
          <DropdownMenu.Item icon={<BellIcon />}>
            Customize Chat
          </DropdownMenu.Item>
        )}
        <DropdownMenu.TriggerItem label="Mute Chat" icon={<BellIcon />}>
          <DropdownMenu.Item>For 15 min</DropdownMenu.Item>
          <DropdownMenu.Item>For 1 hour</DropdownMenu.Item>
          <DropdownMenu.Item>For 8 hours</DropdownMenu.Item>
          <DropdownMenu.Item>For 24 hours</DropdownMenu.Item>
          <DropdownMenu.Item>Until I turn it back on</DropdownMenu.Item>
        </DropdownMenu.TriggerItem>
        <DropdownMenu.Item icon={<BellIcon />}>Mark as Read</DropdownMenu.Item>
        <DropdownMenu.TriggerItem label="Fetch Messages" icon={<BellIcon />}>
          <DropdownMenu.Item>Last 24 hours</DropdownMenu.Item>
          <DropdownMenu.Item>Last 2 days</DropdownMenu.Item>
          <DropdownMenu.Item>Last 3 days</DropdownMenu.Item>
          <DropdownMenu.Item>Last 7 days</DropdownMenu.Item>
        </DropdownMenu.TriggerItem>
        <DropdownMenu.Separator />
        {chat.type === 'chat' && (
          <DropdownMenu.Item icon={<BellIcon />} danger>
            Delete Chat
          </DropdownMenu.Item>
        )}
        {chat.type === 'group-chat' && (
          <DropdownMenu.Item icon={<BellIcon />} danger>
            Leave Chat
          </DropdownMenu.Item>
        )}
      </>
    )
  }

  return (
    <NavbarWrapper>
      {renderIdentity()}

      <Flex gap="2" align="center">
        {enableMembers && (
          <IconButton
            label="Toggle Members"
            active={state.showMembers}
            onClick={() => dispatch({ type: 'TOGGLE_MEMBERS' })}
          >
            <GroupIcon />
          </IconButton>
        )}

        <DropdownMenuTrigger>
          <IconButton label="Options">
            <DotsIcon />
          </IconButton>
          <DropdownMenu align="end">{renderMenuItems()}</DropdownMenu>
        </DropdownMenuTrigger>

        <Separator orientation="vertical" css={{ height: 24 }} />

        <IconButton label="Show Activity Center">
          <BellIcon />
        </IconButton>
      </Flex>
    </NavbarWrapper>
  )
}

const NavbarWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 16px',
})
