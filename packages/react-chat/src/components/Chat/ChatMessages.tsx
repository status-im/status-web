import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Theme } from '../../styles/themes';
import { ChatMessage } from '../models/ChatMessage';

type ChatMessagesProps = {
  messages: ChatMessage[];
  theme: Theme;
};

export function ChatMessages({ messages, theme }: ChatMessagesProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (ref && ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages]);

  return (
    <MessagesWrapper ref={ref}>
      {messages.map(message => (
        <MessageWrapper key={message.date.toDateString()}>
          <Icon />
          <ContentWrapper>
            <MessageHeaderWrapper>
              <UserNameWrapper theme={theme}>{message.sender}</UserNameWrapper>
              <TimeWrapper theme={theme}>{message.date.toLocaleTimeString()}</TimeWrapper>
            </MessageHeaderWrapper>
            <MessageText theme={theme}>{message.content}</MessageText>
          </ContentWrapper>
        </MessageWrapper>
      ))}
    </MessagesWrapper>
  );
}

interface ThemeProps {
  theme: Theme;
}

const MessagesWrapper = styled.div`
  height: calc(100% - 44px);
  overflow: auto;
  padding: 8px 16px;
`;

const MessageWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 8px 0;
  margin-bottom: 8px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;
`;

const MessageHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Icon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #bcbdff;
`;

const UserNameWrapper = styled.div<ThemeProps>`
  font-size: 15px;
  line-height: 22px;
  color: ${({ theme }) => theme.memberNameColor};
`;

const TimeWrapper = styled.div<ThemeProps>`
  font-size: 10px;
  line-height: 14px;
  letter-spacing: 0.2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textSecondaryColor};
  margin-left: 4px;
`;

const MessageText = styled.div<ThemeProps>`
  overflow-wrap: anywhere;
  width: 100%;
  color: ${({ theme }) => theme.textPrimaryColor};
`;
