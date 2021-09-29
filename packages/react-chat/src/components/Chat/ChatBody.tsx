import React from 'react';
import styled from 'styled-components';

import { ChannelData } from '../../helpers/channelsMock';
import { ChatMessage } from '../../models/ChatMessage';
import { Theme } from '../../styles/themes';
import { Channel } from '../Channels';
import { MembersIcon } from '../Icons/MembersIcon';

import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';

interface ChatBodyProps {
  theme: Theme;
  channel: ChannelData;
  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  onClick: () => void;
  showMembers: boolean;
}

export function ChatBody({ theme, channel, messages, sendMessage, onClick, showMembers }: ChatBodyProps) {
  return (
    <ChatBodyWrapper theme={theme}>
      <ChannelWrapper>
        <Channel channel={channel} theme={theme} isActive={true} activeView={true} isMuted={false} />
        <MemberBtn onClick={onClick} className={showMembers ? 'active' : ''} theme={theme}>
          <MembersIcon theme={theme} />
        </MemberBtn>
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
  display: flex;
  justify-content: space-between;
  padding: 0 8px;
`;

const MemberBtn = styled.button<ThemeProps>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  padding: 0;
  margin-top: 12px;

  &.active {
    background: ${({ theme }) => theme.inputColor};
  }
`;
