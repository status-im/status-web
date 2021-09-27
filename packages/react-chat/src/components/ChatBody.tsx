import React from 'react';
import styled from 'styled-components';

export function ChatBody() {
  return <ChatBodyWrapper>Messages</ChatBodyWrapper>;
}

const ChatBodyWrapper = styled.div`
  flex: 1;
  height: 100%;
  background: ${({ theme }) => theme.bodyBackgroundColor};
`;
