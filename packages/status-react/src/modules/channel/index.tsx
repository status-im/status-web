import React, { useRef } from 'react'

import styled, { ThemeProvider } from 'styled-components'

import { ChatStateProvider } from '~/src/contexts/chatStateProvider'
import { IdentityProvider } from '~/src/contexts/identityProvider'
import { MessengerProvider } from '~/src/contexts/messengerProvider'
import { ModalProvider } from '~/src/contexts/modalProvider'
import { NarrowProvider } from '~/src/contexts/narrowProvider'
import { ToastProvider } from '~/src/contexts/toastProvider'
import { GlobalStyle } from '~/src/styles/GlobalStyle'

import { GroupChatRoom } from './GroupChatRoom'

import type { Config } from '~/src/types/config'

interface Props extends Config {
  options: {
    showMembers?: false
  }
}

export const Channel = (props: Props) => {
  const { publicKey, theme, environment } = props

  const ref = useRef<HTMLHeadingElement>(null)

  return (
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
                    <GroupChatRoom />
                    <div id="modal-root" />
                  </ChatStateProvider>
                </MessengerProvider>
              </IdentityProvider>
            </Wrapper>
          </ToastProvider>
        </ModalProvider>
      </NarrowProvider>
    </ThemeProvider>
  )
}

export type { Props as ChannelProps }

const Wrapper = styled.div`
  height: 100%;
  overflow: hidden;
`
