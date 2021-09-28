import React, { useState } from 'react';
import styled from 'styled-components';
import { Theme } from '../../styles/themes';

type ChatInputProps = {
  theme: Theme;
  addMessage: (message: string) => void;
};

export function ChatInput({ theme, addMessage }: ChatInputProps) {
  const [content, setContent] = useState('');

  return (
    <InputWrapper>
      <Input
        theme={theme}
        placeholder={'Message'}
        value={content}
        onChange={e => setContent(e.target.value)}
        onKeyPress={e => {
          if (e.key == 'Enter') {
            addMessage(content);
            setContent('');
          }
        }}
      />
    </InputWrapper>
  );
}

interface ThemeProps {
  theme: Theme;
}

const InputWrapper = styled.div`
  display: flex;
  padding: 6px 8px 6px 10px;
`;
const Input = styled.input<ThemeProps>`
  width: 100%;
  margin-left: 10px;
  height: 40px;
  background: ${({ theme }) => theme.inputColor};
  border-radius: 36px 16px 4px 36px;
  border: 1px solid ${({ theme }) => theme.inputColor};
  padding-left: 12px;
  outline: none;
  font-size: 15px;
  line-height: 22px;

  &:focus {
    outline: none;
    caret-color: ${({ theme }) => theme.notificationColor};
  }
`;
