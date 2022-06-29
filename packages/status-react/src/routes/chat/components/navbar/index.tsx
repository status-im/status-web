import React from 'react'

import { useMatch } from 'react-router-dom'

// import { ChatMenu } from '~/src/components/chat-menu'
import { useAppState } from '~/src/contexts/app-context'
// import { BellIcon } from '~/src/icons/bell-icon'
// import { DotsIcon } from '~/src/icons/dots-icon'
import { GroupIcon } from '~/src/icons/group-icon'
import { useChat } from '~/src/protocol'
import { styled } from '~/src/styles/config'
import {
  /*DropdownMenuTrigger,*/ Flex,
  IconButton /*,Separator*/,
} from '~/src/system'

import { ChatInfo } from '../chat-info'

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

        {/* <Separator orientation="vertical" css={{ height: 24 }} /> */}

        {/* <IconButton label="Show Activity Center">
          <BellIcon />
        </IconButton> */}
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
