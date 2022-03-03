import React, { useState } from 'react'

import styled from 'styled-components'

import { Channels } from '~/src/components/Channels/Channels'
import { ChatBody } from '~/src/components/Chat/ChatBody'
import { ChatCreation } from '~/src/components/Chat/ChatCreation'
import { Members } from '~/src/components/Members/Members'
import { AgreementModal } from '~/src/components/Modals/AgreementModal'
import { CoinbaseModal } from '~/src/components/Modals/CoinbaseModal'
import { CommunityModal } from '~/src/components/Modals/CommunityModal'
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
import { useMessengerContext } from '~/src/contexts/messengerProvider'
import { useNarrow } from '~/src/contexts/narrowProvider'

import { CommunitySidebar } from './CommunitySidebar'

function Modals() {
  return (
    <>
      <CommunityModal subtitle="Public Community" />
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

export function CommunityChatRoom() {
  const [state] = useChatState()
  const [showMembers, setShowMembers] = useState(false)
  const [editGroup, setEditGroup] = useState(false)
  const narrow = useNarrow()
  const { activeChannel } = useMessengerContext()

  return (
    <ChatWrapper>
      {!narrow && (
        <ChannelsWrapper>
          <StyledCommunity />
          <Channels setEditGroup={setEditGroup} />
        </ChannelsWrapper>
      )}
      {state === ChatState.ChatBody && (
        <ChatBody
          onClick={() => setShowMembers(!showMembers)}
          showMembers={showMembers}
          permission={true}
          editGroup={editGroup}
          setEditGroup={setEditGroup}
        />
      )}
      {showMembers &&
        !narrow &&
        state === ChatState.ChatBody &&
        activeChannel &&
        activeChannel.type !== 'dm' && <Members />}
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

const StyledCommunity = styled(CommunitySidebar)`
  padding: 0 0 0 8px;
  margin: 0 0 16px;
`
