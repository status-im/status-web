import React from 'react'

import { useMatch } from 'react-router-dom'

// import { ChatMenu } from '../../../../components/chat-menu'
import { useAppState } from '../../../../contexts/app-context'
import { BellIcon } from '../../../../icons/bell-icon'
// import { DotsIcon } from '../../../../icons/dots-icon'
import { GroupIcon } from '../../../../icons/group-icon'
import { useActivityCenter, useChat } from '../../../../protocol'
import { styled } from '../../../../styles/config'
import { Flex, IconButton, Separator } from '../../../../system'
import { ChatInfo } from '../chat-info'

interface Props {
  enableMembers: boolean
}

export const Navbar = (props: Props) => {
  const { enableMembers } = props

  const { state, dispatch } = useAppState()
  const { params } = useMatch(':id')! // eslint-disable-line @typescript-eslint/no-non-null-assertion

  const chat = useChat(params.id!)
  const { totalCount } = useActivityCenter()

  return (
    <NavbarWrapper>
      <ChatInfo chat={chat} />

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

        {/* <DropdownMenuTrigger>
          <IconButton label="Options">
            <DotsIcon />
          </IconButton>
          <ChatMenu type="dropdown" />
        </DropdownMenuTrigger> */}

        <Separator orientation="vertical" css={{ height: 24 }} />

        {/* button; squeare aspect ration; triggers pop-over */}
        {/* wrap in popover trigger */}
        {/* todo: tabs (switching), see radix */}
        {/* todo: mention component; add to desing system */}
        {/* avatar, username, chatmesage, embedi into context in activity center; plus add tags/where below */}
        {/* todo: icon with notification badge */}
        <IconButton label="Show Activity Center">
          {/* <div> */}
          <>
            <BellIcon />
            {totalCount > 0 && (
              <Badge>{totalCount < 99 ? totalCount : '∞'}</Badge>
            )}
          </>
          {/* </div> */}
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
