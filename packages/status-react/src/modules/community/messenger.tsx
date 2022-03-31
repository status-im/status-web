import React from 'react'

import { Route, Routes } from 'react-router-dom'

import { MainSidebar } from '~/src/components/main-sidebar'
import { Chat } from '~/src/routes/chat'
import { NewChat } from '~/src/routes/new-chat'
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
  return (
    <Wrapper>
      <MainSidebar />
      <Routes>
        <Route path="/:id" element={<Chat />} />
        <Route path="/new" element={<NewChat />} />
      </Routes>
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
