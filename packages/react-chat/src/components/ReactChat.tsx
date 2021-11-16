import React, { useRef } from "react";
import { ThemeProvider } from "styled-components";
import styled from "styled-components";

import { BlockedUsersProvider } from "../contexts/blockedUsersProvider";
import { FetchMetadataProvider } from "../contexts/fetchMetadataProvider";
import { FriendsProvider } from "../contexts/friendsProvider";
import { ModalProvider } from "../contexts/modalProvider";
import { NarrowProvider } from "../contexts/narrowProvider";
import { Metadata } from "../models/Metadata";
import { GlobalStyle } from "../styles/GlobalStyle";
import { Theme } from "../styles/themes";

import { ChatLoader } from "./ChatLoader";

interface ReactChatProps {
  theme: Theme;
  communityKey: string;
  fetchMetadata?: (url: string) => Promise<Metadata | undefined>;
}

export function ReactChat({
  theme,
  communityKey,
  fetchMetadata,
}: ReactChatProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  return (
    <ThemeProvider theme={theme}>
      <NarrowProvider myRef={ref}>
        <FetchMetadataProvider fetchMetadata={fetchMetadata}>
          <BlockedUsersProvider>
            <FriendsProvider>
              <ModalProvider>
                <Wrapper ref={ref}>
                  <GlobalStyle />
                  <ChatLoader communityKey={communityKey} />
                  <div id="modal-root" />
                </Wrapper>
              </ModalProvider>
            </FriendsProvider>
          </BlockedUsersProvider>
        </FetchMetadataProvider>
      </NarrowProvider>
    </ThemeProvider>
  );
}

const Wrapper = styled.div`
  height: 100%;
  overflow: hidden;
`;
