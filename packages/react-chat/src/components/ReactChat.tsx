import React, { useRef } from "react";
import { ThemeProvider } from "styled-components";
import styled from "styled-components";

import { NarrowProvider } from "../contexts/narrowProvider";
import { CommunityData } from "../helpers/communityMock";
import { Metadata } from "../models/Metadata";
import { GlobalStyle } from "../styles/GlobalStyle";
import { Theme } from "../styles/themes";

import { Chat } from "./Chat";

interface ReactChatProps {
  theme: Theme;
  community: CommunityData;
  fetchMetadata?: (url: string) => Promise<Metadata | undefined>;
}

export function ReactChat({ theme, community, fetchMetadata }: ReactChatProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  return (
    <ThemeProvider theme={theme}>
      <NarrowProvider myRef={ref}>
        <Wrapper ref={ref}>
          <GlobalStyle />
          <Chat
            community={community}
            fetchMetadata={fetchMetadata}
            theme={theme}
          />
        </Wrapper>
      </NarrowProvider>
    </ThemeProvider>
  );
}

const Wrapper = styled.div`
  height: 100%;
  overflow: hidden;
`;
