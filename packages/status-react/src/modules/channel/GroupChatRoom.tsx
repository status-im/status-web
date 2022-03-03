import React, { useState } from 'react'

import styled from 'styled-components'

import { Channels } from '~/src/components/Channels/Channels'
import { ChatCreation } from '~/src/components/Chat/ChatCreation'
import { AgreementModal } from '~/src/components/Modals/AgreementModal'
import { CoinbaseModal } from '~/src/components/Modals/CoinbaseModal'
import { EditModal } from '~/src/components/Modals/EditModal'
import { LeavingModal } from '~/src/components/Modals/LeavingModal'
import { LogoutModal } from '~/src/components/Modals/LogoutModal'
import { ProfileFoundModal } from '~/src/components/Modals/ProfileFoundModal'
import { ProfileModal } from '~/src/components/Modals/ProfileModal'
import { StatusModal } from '~/src/components/Modals/StatusModal'
import { UserCreationModal } from '~/src/components/Modals/UserCreationModal'
import { UserCreationStartModal } from '~/src/components/Modals/UserCreationStartModal'
import { WalletConnectModal } from '~/src/components/Modals/WalletConnectModal'
import { WalletModal } from '~/src/components/Modals/WalletModal'
import { ToastMessageList } from '~/src/components/ToastMessages/ToastMessageList'
import { ChatState, useChatState } from '~/src/contexts/chatStateProvider'
import { useNarrow } from '~/src/contexts/narrowProvider'

import { GroupChatBody } from './GroupChat/GroupChatBody'
import { GroupMembers } from './GroupMembers/GroupMembers'

// import type { ChannelProps } from '.'

function Modals() {
  return (
    <>
      <UserCreationModal />
      <EditModal />
      <ProfileModal />
      <StatusModal />
      <WalletModal />
      <WalletConnectModal />
      <CoinbaseModal />
      <LogoutModal />
      <AgreementModal />
      <ProfileFoundModal />
      <UserCreationStartModal />
      <LeavingModal />
    </>
  )
}

// interface Props {
//   options: ChannelProps['options']
// }

export const GroupChatRoom = () => {
  const [state] = useChatState()
  const [showMembers, setShowMembers] = useState(false)
  const [editGroup, setEditGroup] = useState(false)
  const narrow = useNarrow()

  return (
    <ChatWrapper>
      {!narrow && (
        <ChannelsWrapper>
          <Channels setEditGroup={setEditGroup} />
        </ChannelsWrapper>
      )}
      {state === ChatState.ChatBody && (
        <GroupChatBody
          onClick={() => setShowMembers(!showMembers)}
          showMembers={showMembers}
          permission={true}
          editGroup={editGroup}
          setEditGroup={setEditGroup}
        />
      )}
      {showMembers && !narrow && state === ChatState.ChatBody && (
        <GroupMembers />
      )}
      {state === ChatState.ChatCreation && <ChatCreation />}
      <Modals />
      <ToastMessageList />
    </ChatWrapper>
  )
}

const ChatWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
`

const ChannelsWrapper = styled.div`
  width: 21%;
  height: 100%;
  min-width: 250px;
  background-color: ${({ theme }) => theme.sectionBackgroundColor};
  padding: 10px 16px;
  display: flex;
  flex-direction: column;
`
