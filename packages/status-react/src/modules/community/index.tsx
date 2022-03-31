import React, { useRef } from 'react'

import { BrowserRouter } from 'react-router-dom'
import styled, { ThemeProvider } from 'styled-components'

import { AppProvider } from '~/src/contexts/app-context'
import { ChatStateProvider } from '~/src/contexts/chatStateProvider'
import { IdentityProvider } from '~/src/contexts/identityProvider'
import { MessengerProvider } from '~/src/contexts/messengerProvider'
import { ModalProvider } from '~/src/contexts/modalProvider'
import { NarrowProvider } from '~/src/contexts/narrowProvider'
import { ScrollProvider } from '~/src/contexts/scrollProvider'
import { ToastProvider } from '~/src/contexts/toastProvider'
import { GlobalStyle } from '~/src/styles/GlobalStyle'

import { Messenger } from './messenger'

import type { Config } from '~/src/types/config'

type Props = Config

export const Community = (props: Props) => {
  const {
    theme,
    environment,
    publicKey,
    router: Router = BrowserRouter,
  } = props

  const ref = useRef<HTMLHeadingElement>(null)

  return (
    <Router>
      <AppProvider>
        <ThemeProvider theme={theme}>
          <NarrowProvider myRef={ref}>
            <ModalProvider>
              <ToastProvider>
                <Wrapper ref={ref}>
                  <GlobalStyle />
                  <IdentityProvider>
                    <MessengerProvider
                      publicKey={publicKey}
                      environment={environment}
                    >
                      <ChatStateProvider>
                        <ScrollProvider>
                          <Messenger />
                          <div id="modal-root" />
                        </ScrollProvider>
                      </ChatStateProvider>
                    </MessengerProvider>
                  </IdentityProvider>
                </Wrapper>
              </ToastProvider>
            </ModalProvider>
          </NarrowProvider>
        </ThemeProvider>
      </AppProvider>
    </Router>
  )
}

export type { Props as CommunityProps }

const Wrapper = styled.div`
  height: 100%;
  overflow: hidden;
`
