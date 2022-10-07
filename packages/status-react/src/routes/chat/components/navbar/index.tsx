import React from 'react'

import { useMatch } from 'react-router-dom'

// import { ChatMenu } from '../../../../components/chat-menu'
import { useAppState } from '../../../../contexts/app-context'
// import { DotsIcon } from '../../../../icons/dots-icon'
import { GroupIcon } from '../../../../icons/group-icon'
import { useChat } from '../../../../protocol'
import { styled } from '../../../../styles/config'
import { Flex, IconButton, Separator } from '../../../../system'
import { ChatInfo } from '../chat-info'
import { ActivityCenterPopover } from './components/activity-center-popover'

interface Props {
  enableMembers: boolean
}

export const Navbar = (props: Props) => {
  const { enableMembers } = props

  const { state, dispatch } = useAppState()

  const { params } = useMatch(':id')! // eslint-disable-line @typescript-eslint/no-non-null-assertion

  const chat = useChat(params.id!)

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

        <ActivityCenterPopover />
      </Flex>
    </NavbarWrapper>
  )
}

const NavbarWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 20px',
})
