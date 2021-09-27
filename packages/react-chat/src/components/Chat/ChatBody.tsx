import React, { useCallback, useState } from "react";
import styled from "styled-components";

import { ChatMessage } from "../models/ChatMessage";

import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";

export function ChatBody() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const addMessage = useCallback(
    (message: string) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "User1", date: new Date(), content: message },
      ]);
    },
    [messages]
  );

  return (
    <ChatBodyWrapper>
      <ChatMessages messages={messages} />
      <ChatInput addMessage={addMessage} />
    </ChatBodyWrapper>
  );
}

const ChatBodyWrapper = styled.div`
  flex: 1;
  height: 100%;
  max-width: 50%;
  background: ${({ theme }) => theme.bodyBackgroundColor};
`;
