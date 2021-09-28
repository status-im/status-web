import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { ChannelData } from '../../helpers/channelsMock';
import { Theme } from '../../styles/themes';
import { Channel } from '../Channels';
import { ChatMessage } from '../models/ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';

interface ChatBodyProps {
  theme: Theme;
  channel: ChannelData;
}

export function ChatBody({ theme, channel }: ChatBodyProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const addMessage = useCallback(
    (message: string) => {
      setMessages(prevMessages => [...prevMessages, { sender: 'User1', date: new Date(), content: message }]);
    },
    [messages]
  );

  return (
    <ChatBodyWrapper theme={theme}>
      <Channel channel={channel} theme={theme} isActive={true} activeView={true} />
      <ChatMessages messages={messages} />
      <ChatInput addMessage={addMessage} />
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
  max-width: 50%;
  background: ${({ theme }) => theme.bodyBackgroundColor};
`;
