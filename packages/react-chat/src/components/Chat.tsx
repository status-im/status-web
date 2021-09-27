import React from "react";
import styled from "styled-components";

import { Theme } from "../styles/themes";

import { Channels } from "./Channels";
import { ChatBody } from "./ChatBody";
import { Members } from "./Members";

interface ChatProps {
  theme: Theme;
  channels?: boolean;
  members?: boolean;
}

export function Chat({ theme, channels, members }: ChatProps) {
  return (
    <ChatWrapper>
      {channels && <Channels theme={theme} />}
      <ChatBody />
      {members && <Members />}
    </ChatWrapper>
  );
}

const ChatWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
`;
