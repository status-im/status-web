import React, { useRef } from 'react'

import styled, { ThemeProvider } from 'styled-components'

import { ChatStateProvider } from '~/src/contexts/chatStateProvider'
import { ConfigProvider } from '~/src/contexts/configProvider'
import { IdentityProvider } from '~/src/contexts/identityProvider'
import { MessengerProvider } from '~/src/contexts/messengerProvider'
import { ModalProvider } from '~/src/contexts/modalProvider'
import { NarrowProvider } from '~/src/contexts/narrowProvider'
import { ToastProvider } from '~/src/contexts/toastProvider'
import { GlobalStyle } from '~/src/styles/GlobalStyle'

import { GroupChatRoom } from './GroupChatRoom'

import type { ConfigType } from '~/src/contexts/configProvider'
import type { Theme } from '~/src/styles/themes'

interface Props {
  communityKey: string
  theme: Theme
  config: ConfigType
}

export const Channel = (props: Props) => {
  const { communityKey, theme, config } = props

  const ref = useRef<HTMLHeadingElement>(null)

  return (
    <ConfigProvider config={config}>
      <ThemeProvider theme={theme}>
        <NarrowProvider myRef={ref}>
          <ModalProvider>
            <ToastProvider>
              <Wrapper ref={ref}>
                <GlobalStyle />
                <IdentityProvider>
                  <MessengerProvider communityKey={communityKey}>
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
    </ConfigProvider>
  )
}

export type { Props as ChannelProps }

const Wrapper = styled.div`
  height: 100%;
  overflow: hidden;
`
