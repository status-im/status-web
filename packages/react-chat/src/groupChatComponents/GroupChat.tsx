import React, { useRef } from "react";
import { ThemeProvider } from "styled-components";
import styled from "styled-components";

import { ConfigType } from "..";
import { ChatStateProvider } from "../contexts/chatStateProvider";
import { ConfigProvider } from "../contexts/configProvider";
import { FetchMetadataProvider } from "../contexts/fetchMetadataProvider";
import { IdentityProvider } from "../contexts/identityProvider";
import { MessengerProvider } from "../contexts/messengerProvider";
import { ModalProvider } from "../contexts/modalProvider";
import { NarrowProvider } from "../contexts/narrowProvider";
import { ToastProvider } from "../contexts/toastProvider";
import { Metadata } from "../models/Metadata";
import { GlobalStyle } from "../styles/GlobalStyle";
import { Theme } from "../styles/themes";

import { GroupChatRoom } from "./GroupChatRoom";

interface GroupChatProps {
  theme: Theme;
  config: ConfigType;
  fetchMetadata?: (url: string) => Promise<Metadata | undefined>;
}

export function GroupChat({ theme, config, fetchMetadata }: GroupChatProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  return (
    <ConfigProvider config={config}>
      <ThemeProvider theme={theme}>
        <NarrowProvider myRef={ref}>
          <FetchMetadataProvider fetchMetadata={fetchMetadata}>
            <ModalProvider>
              <ToastProvider>
                <Wrapper ref={ref}>
                  <GlobalStyle />
                  <IdentityProvider>
                    <MessengerProvider communityKey={undefined}>
                      <ChatStateProvider>
                        <GroupChatRoom />
                        <div id="modal-root" />
                      </ChatStateProvider>
                    </MessengerProvider>
                  </IdentityProvider>
                </Wrapper>
              </ToastProvider>
            </ModalProvider>
          </FetchMetadataProvider>
        </NarrowProvider>
      </ThemeProvider>
    </ConfigProvider>
  );
}

const Wrapper = styled.div`
  height: 100%;
  overflow: hidden;
`;
