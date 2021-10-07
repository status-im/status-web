import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import { ChatMessage } from "../../models/ChatMessage";
import { Metadata } from "../../models/Metadata";
import { UserIcon } from "../Icons/UserIcon";
import { textSmallStyles } from "../Text";

import { ChatMessageContent } from "./ChatMessageContent";

type ChatMessagesProps = {
  messages: ChatMessage[];
  fetchMetadata?: (url: string) => Promise<Metadata | undefined>;
};

export function ChatMessages({ messages, fetchMetadata }: ChatMessagesProps) {
  const [scrollOnBot, setScrollOnBot] = useState(false);
  const ref = useRef<HTMLHeadingElement>(null);
  const today = useMemo(() => new Date().getDay(), []);
  useEffect(() => {
    if (ref && ref.current && scrollOnBot) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages, messages.length, scrollOnBot]);

  useEffect(() => {
    const setScroll = () => {
      if (ref && ref.current) {
        if (
          ref.current.scrollTop + ref.current.clientHeight ==
          ref.current.scrollHeight
        ) {
          setScrollOnBot(true);
        } else {
          if (scrollOnBot == true) {
            setScrollOnBot(false);
          }
        }
      }
    };
    ref.current?.addEventListener("scroll", setScroll);
    return () => ref.current?.removeEventListener("scroll", setScroll);
  }, [ref, scrollOnBot]);

  return (
    <MessagesWrapper ref={ref}>
      {messages.map((message, idx) => {
        return (
          <MessageOuterWrapper key={message.date.getTime()}>
            {(idx === 0 ||
              messages[idx - 1].date.getDay() !=
                messages[idx].date.getDay()) && (
              <DateSeparator>
                {message.date.getDay() === today
                  ? "Today"
                  : message.date.toLocaleDateString()}
              </DateSeparator>
            )}
            <MessageWrapper>
              <Icon>
                <UserIcon />
              </Icon>

              <ContentWrapper>
                <MessageHeaderWrapper>
                  <UserNameWrapper>
                    {message.sender.slice(0, 10)}
                  </UserNameWrapper>
                  <TimeWrapper>{message.date.toLocaleString()}</TimeWrapper>
                </MessageHeaderWrapper>
                <MessageText>
                  <ChatMessageContent
                    message={message}
                    fetchMetadata={fetchMetadata}
                  />
                </MessageText>
              </ContentWrapper>
            </MessageWrapper>
          </MessageOuterWrapper>
        );
      })}
    </MessagesWrapper>
  );
}

const MessagesWrapper = styled.div`
  height: calc(100% - 44px);
  overflow: auto;
  padding: 8px 16px 0;

  &::-webkit-scrollbar {
    width: 0;
  }
`;

const MessageWrapper = styled.div`
  width: 100%;
  display: flex;
  padding: 8px 0;
  margin-bottom: 8px;
`;

const MessageOuterWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const DateSeparator = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  height: 100%;
  text-align: center;
  justify-content: center;
  align-items: center;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  color: #939ba1;
  margin-top: 16px;
  margin-bottom: 16px;

  ${textSmallStyles}
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

export const Icon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: end;
  border-radius: 50%;
  background-color: #bcbdff;
  flex-shrink: 0;
`;

const UserNameWrapper = styled.div`
  font-size: 15px;
  line-height: 22px;
  color: ${({ theme }) => theme.tertiary};
`;

const TimeWrapper = styled.div`
  font-size: 10px;
  line-height: 14px;
  letter-spacing: 0.2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.secondary};
  margin-left: 4px;
`;

const MessageText = styled.div`
  overflow-wrap: anywhere;
  width: 100%;
  white-space: pre-wrap;
  color: ${({ theme }) => theme.primary};
`;
