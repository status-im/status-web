import React from "react";
import styled from "styled-components";

import { ChannelData } from "../../helpers/channelsMock";
import { ChatMessage } from "../../models/ChatMessage";
import { Theme } from "../../styles/themes";
import { Channel } from "../Channels";

import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";

interface ChatBodyProps {
  theme: Theme;
  channel: ChannelData;
  messages: ChatMessage[];
  sendMessage: (text: string) => void;
}

export function ChatBody({
  theme,
  channel,
  messages,
  sendMessage,
}: ChatBodyProps) {
  return (
    <ChatBodyWrapper theme={theme}>
      <ChannelWrapper>
        <Channel
          channel={channel}
          theme={theme}
          isActive={true}
          activeView={true}
        />
      </ChannelWrapper>
      <ChatMessages messages={messages} theme={theme} />
      <ChatInput theme={theme} addMessage={sendMessage} />
    </ChatBodyWrapper>
  );
}
interface ThemeProps {
  theme: Theme;
}

const ChatBodyWrapper = styled.div<ThemeProps>`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  background: ${({ theme }) => theme.bodyBackgroundColor};
`;

const ChannelWrapper = styled.div`
  padding-left: 8px;
`;
