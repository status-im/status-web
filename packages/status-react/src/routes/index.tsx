import React from 'react'

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useMatch,
} from 'react-router-dom'

import { MainSidebar } from '~/src/components/main-sidebar'
import { AppProvider } from '~/src/contexts/app-context'
import { DialogProvider } from '~/src/contexts/dialog-context'
import { ThemeProvider } from '~/src/contexts/theme-context'
import { ProtocolProvider, useProtocol } from '~/src/protocol'
import { Chat } from '~/src/routes/chat'
import { styled } from '~/src/styles/config'
import { GlobalStyle } from '~/src/styles/GlobalStyle'

import type { Config } from '~/src/types/config'

interface Props extends Config {
  meta?: string
}

// TODO: use a better way to handle this
const Gate = (props: { children: JSX.Element }) => {
  const { client } = useProtocol()

  const { params } = useMatch(':id')!
  const chatId = params.id!

  const chat = client.community.getChat(chatId)

  if (!chat) {
    return (
      <Navigate to={`/${client.community._chats[0].uuid ?? '/'}`} replace />
    )
  }

  return props.children
}

export const Community = (props: Props) => {
  const { theme, router: Router = BrowserRouter } = props

  return (
    <Router>
      <AppProvider config={props}>
        <ThemeProvider theme={theme}>
          <ProtocolProvider options={{ publicKey: props.publicKey }}>
            <DialogProvider>
              <GlobalStyle />
              <Wrapper>
                <MainSidebar />
                <Routes>
                  <Route
                    path="/:id"
                    element={
                      <Gate>
                        <Chat />
                      </Gate>
                    }
                  />
                </Routes>
              </Wrapper>
            </DialogProvider>
          </ProtocolProvider>
        </ThemeProvider>
      </AppProvider>
    </Router>
  )
}

export type { Props as CommunityProps }

const Wrapper = styled('div', {
  overflow: 'hidden',
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'stretch',
  background: '$background',
})
