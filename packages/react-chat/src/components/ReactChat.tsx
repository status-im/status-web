import React, { useRef } from "react";
import { ThemeProvider } from "styled-components";
import styled from "styled-components";

import { ConfigType } from "..";
import { ActivityProvider } from "../contexts/activityProvider";
import { ConfigProvider } from "../contexts/configProvider";
import { FetchMetadataProvider } from "../contexts/fetchMetadataProvider";
import { ModalProvider } from "../contexts/modalProvider";
import { NarrowProvider } from "../contexts/narrowProvider";
import { ToastProvider } from "../contexts/toastProvider";
import { UserCreationStateProvider } from "../contexts/userCreationStateProvider";
import { Metadata } from "../models/Metadata";
import { GlobalStyle } from "../styles/GlobalStyle";
import { Theme } from "../styles/themes";

import { ChatLoader } from "./ChatLoader";

interface ReactChatProps {
  theme: Theme;
  config: ConfigType;
  fetchMetadata?: (url: string) => Promise<Metadata | undefined>;
}

export function ReactChat({ theme, config, fetchMetadata }: ReactChatProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  return (
    <ConfigProvider config={config}>
      <ThemeProvider theme={theme}>
        <NarrowProvider myRef={ref}>
          <FetchMetadataProvider fetchMetadata={fetchMetadata}>
            <ModalProvider>
              <ActivityProvider>
                <UserCreationStateProvider>
                  <ToastProvider>
                    <Wrapper ref={ref}>
                      <GlobalStyle />
                      <ChatLoader />
                      <div id="modal-root" />
                    </Wrapper>
                  </ToastProvider>
                </UserCreationStateProvider>
              </ActivityProvider>
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
