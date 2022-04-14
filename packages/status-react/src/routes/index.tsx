import React from 'react'

import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AppProvider } from '~/src/contexts/app-context'
import { DialogProvider } from '~/src/contexts/dialog-context'
import { styled } from '~/src/styles/config'

import { MainSidebar } from '../components/main-sidebar'
import { Box } from '../system'
import { Chat } from './chat'
import { NewChat } from './new-chat'

import type { Config } from '~/src/types/config'

type Props = Config

export const Community = (props: Props) => {
  const {
    // theme,
    // environment,
    // publicKey,
    router: Router = BrowserRouter,
  } = props

  const { options } = props

  return (
    <Router>
      <AppProvider config={props}>
        <DialogProvider>
          <Box css={{ flex: '1 0 100%' }}>
            <Wrapper>
              {options.enableMembers && <MainSidebar />}
              <Routes>
                <Route path="/:id" element={<Chat />} />
                <Route path="/new" element={<NewChat />} />
              </Routes>
            </Wrapper>
          </Box>
        </DialogProvider>
      </AppProvider>
    </Router>
  )
}

export type { Props as CommunityProps }

const Wrapper = styled('div', {
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'stretch',
})
