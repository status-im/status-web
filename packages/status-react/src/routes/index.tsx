import React from 'react'

import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { MainSidebar } from '~/src/components/main-sidebar'
import { AppProvider } from '~/src/contexts/app-context'
import { DialogProvider } from '~/src/contexts/dialog-context'
import { ThemeProvider } from '~/src/contexts/theme-context'
import { Chat } from '~/src/routes/chat'
import { NewChat } from '~/src/routes/new-chat'
import { styled } from '~/src/styles/config'
import { GlobalStyle } from '~/src/styles/GlobalStyle'

import type { Config } from '~/src/types/config'

type Props = Config

export const Community = (props: Props) => {
  const { theme, router: Router = BrowserRouter } = props

  return (
    <Router>
      <AppProvider config={props}>
        <ThemeProvider theme={theme}>
          <DialogProvider>
            <GlobalStyle />
            <Wrapper>
              <MainSidebar />
              <Routes>
                <Route path="/:id" element={<Chat />} />
                <Route path="/new" element={<NewChat />} />
              </Routes>
            </Wrapper>
          </DialogProvider>
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
