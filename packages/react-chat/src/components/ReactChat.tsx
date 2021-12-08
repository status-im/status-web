import React, { useRef } from "react";
import { ThemeProvider } from "styled-components";
import styled from "styled-components";

import { ActivityProvider } from "../contexts/activityProvider";
import { FetchMetadataProvider } from "../contexts/fetchMetadataProvider";
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
          <ModalProvider>
            <ActivityProvider>
              <Wrapper ref={ref}>
                <GlobalStyle />
                <ChatLoader communityKey={communityKey} />
                <div id="modal-root" />
              </Wrapper>
            </ActivityProvider>
          </ModalProvider>
        </FetchMetadataProvider>
      </NarrowProvider>
    </ThemeProvider>
  );
}

const Wrapper = styled.div`
  height: 100%;
  overflow: hidden;
`;
