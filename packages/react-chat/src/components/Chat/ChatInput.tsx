import React, { useState } from "react";
import styled from "styled-components";

type ChatInputProps = {
  addMessage: (message: string) => void;
};

export function ChatInput({ addMessage }: ChatInputProps) {
  const [content, setContent] = useState("");

  return (
    <Input
      placeholder={"Message"}
      value={content}
      onChange={(e) => setContent(e.target.value)}
      onKeyPress={(e) => {
        if (e.key == "Enter") {
          addMessage(content);
          setContent("");
        }
      }}
    />
  );
}

const Input = styled.input`
  width: 100%;
  margin-left: 8px;
  margin-right: 8px;
  margin-bottom: 4px;
  height: 40px;
  background: #eef2f5;
  border-radius: 36px 16px 4px 36px;
  border: 0px;
  padding-left: 12px;
  outline: none;

  &:focus {
    border: 1px solid grey;
  }
`;
