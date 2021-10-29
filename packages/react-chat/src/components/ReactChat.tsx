import React, { useRef } from "react";
import { ThemeProvider } from "styled-components";
import styled from "styled-components";

import { FetchMetadataProvider } from "../contexts/fetchMetadataProvider";
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
          <Wrapper ref={ref}>
            <GlobalStyle />
            <ChatLoader communityKey={communityKey} />
          </Wrapper>
        </FetchMetadataProvider>
      </NarrowProvider>
    </ThemeProvider>
  );
}

const Wrapper = styled.div`
  height: 100%;
  overflow: hidden;
`;
