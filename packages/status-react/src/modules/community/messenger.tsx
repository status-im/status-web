import React from 'react'

import { Route, Routes } from 'react-router-dom'

import { MainSidebar } from '~/src/components/main-sidebar'
import { useAppState } from '~/src/contexts/app-context'
import { Chat } from '~/src/routes/chat'
import { NewChat } from '~/src/routes/new-chat'
import { styled } from '~/src/styles/config'

export function Messenger() {
  const { options } = useAppState()

  return (
    <Wrapper>
      {options.enableMembers && <MainSidebar />}
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
  background: '$background',
})
