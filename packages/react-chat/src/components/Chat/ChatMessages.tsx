import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import { ChatMessage } from "../models/ChatMessage";

type ChatMessagesProps = {
  messages: ChatMessage[];
};

export function ChatMessages({ messages }: ChatMessagesProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (ref && ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages]);

  return (
    <MessagesWrapper ref={ref}>
      {messages.map((message) => (
        <MessageWrapper key={message.date.toDateString()}>
          <IconWrapper>
            <Icon />
          </IconWrapper>
          <ContentWrapper>
            <MessageHeaderWrapper>
              <UserNameWrapper>{message.sender}</UserNameWrapper>
              <TimeWrapper>{message.date.toLocaleTimeString()}</TimeWrapper>
            </MessageHeaderWrapper>
            <MessageText>{message.content}</MessageText>
          </ContentWrapper>
        </MessageWrapper>
      ))}
    </MessagesWrapper>
  );
}

const MessageText = styled.div`
  overflow-wrap: anywhere;
  width: 100%;
`;

const MessageHeaderWrapper = styled.div`
  display: flex;
`;

const TimeWrapper = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  line-height: 14px;
  letter-spacing: 0.2px;
  text-transform: uppercase;
  color: #939ba1;

  text-align: center;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 4px;
`;

const UserNameWrapper = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Icon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: blue;
`;

const IconWrapper = styled.div`
  margin-left: 16px;
  margin-right: 8px;
`;

const MessageWrapper = styled.div`
  width: 100%;
  display: flex;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const MessagesWrapper = styled.div`
  height: calc(100% - 44px);
  overflow: auto;
`;
