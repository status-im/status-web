import React from 'react';
import styled from 'styled-components';
import { ChannelData } from '../helpers/channelsMock';
import { Theme } from '../styles/themes';
import { Channel } from './Channels';

interface ChatBodyProps {
  theme: Theme;
  channel: ChannelData;
}

export function ChatBody({ theme, channel }: ChatBodyProps) {
  return (
    <ChatBodyWrapper theme={theme}>
      <Channel channel={channel} theme={theme} isActive={true} activeView={true} />
    </ChatBodyWrapper>
  );
}

interface ThemeProps {
  theme: Theme;
}

const ChatBodyWrapper = styled.div<ThemeProps>`
  flex: 1;
  height: 100%;
  background: ${({ theme }) => theme.bodyBackgroundColor};
`;
