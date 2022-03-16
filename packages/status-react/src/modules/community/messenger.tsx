import React from 'react'

import { Chat } from '~/src/components/chat'
import { MainSidebar } from '~/src/components/main-sidebar'
import { NewChat } from '~/src/components/new-chat'
import { useAppState } from '~/src/contexts/app-context'
import { styled } from '~/src/styles/config'

// import { AgreementModal } from '~/src/components/Modals/AgreementModal'
// import { CoinbaseModal } from '~/src/components/Modals/CoinbaseModal'
// import { CommunityModal } from '~/src/components/Modals/CommunityModal'
// import { EditModal } from '~/src/components/Modals/EditModal'
// import { LeavingModal } from '~/src/components/Modals/LeavingModal'
// import { LogoutModal } from '~/src/components/Modals/LogoutModal'
// import { ProfileFoundModal } from '~/src/components/Modals/ProfileFoundModal'
// import { ProfileModal } from '~/src/components/Modals/ProfileModal'
// import { StatusModal } from '~/src/components/Modals/StatusModal'
// import { UserCreationModal } from '~/src/components/Modals/UserCreationModal'
// import { UserCreationStartModal } from '~/src/components/Modals/UserCreationStartModal'
// import { WalletConnectModal } from '~/src/components/Modals/WalletConnectModal'
// import { WalletModal } from '~/src/components/Modals/WalletModal'

// function Modals() {
//   return (
//     <>
//       <CommunityModal subtitle="Public Community" />
//       <UserCreationModal />
//       <EditModal />
//       <ProfileModal />
//       <StatusModal />
//       <WalletModal />
//       <WalletConnectModal />
//       <CoinbaseModal />
//       <LogoutModal />
//       <AgreementModal />
//       <ProfileFoundModal />
//       <UserCreationStartModal />
//       <LeavingModal />
//     </>
//   )
// }

export function Messenger() {
  const { state } = useAppState()

  return (
    <Wrapper>
      <MainSidebar />
      {state.view === 'new-chat' && <NewChat />}
      {(state.view === 'channel' || state.view === 'chat') && <Chat />}
    </Wrapper>
  )
}

const Wrapper = styled('div', {
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'stretch',
})
