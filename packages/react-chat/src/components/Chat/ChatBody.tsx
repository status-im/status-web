import React from "react";
import styled from "styled-components";

import { ChannelData } from "../../helpers/channelsMock";
import { useMessenger } from "../../hooks/useMessenger";
import { Theme } from "../../styles/themes";
import { Channel } from "../Channels";

import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";

interface ChatBodyProps {
  theme: Theme;
  channel: ChannelData;
}

export function ChatBody({ theme, channel }: ChatBodyProps) {
  const { messages, sendMessage } = useMessenger(channel.name);

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
