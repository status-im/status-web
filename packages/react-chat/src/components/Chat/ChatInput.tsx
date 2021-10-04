import { Picker } from "emoji-mart";
import React, { useState } from "react";
import styled from "styled-components";

import { lightTheme, Theme } from "../../styles/themes";
import { EmojiIcon } from "../Icons/EmojiIcon";
import { GifIcon } from "../Icons/GifIcon";
import { PictureIcon } from "../Icons/PictureIcon";
import { StickerIcon } from "../Icons/StickerIcon";
import "emoji-mart/css/emoji-mart.css";

type ChatInputProps = {
  theme: Theme;
  addMessage: (message: string) => void;
};

export function ChatInput({ theme, addMessage }: ChatInputProps) {
  const [content, setContent] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const addEmoji = (e: any) => {
    const sym = e.unified.split("-");
    const codesArray: any[] = [];
    sym.forEach((el: string) => codesArray.push("0x" + el));
    const emoji = String.fromCodePoint(...codesArray);
    setContent(content + emoji);
  };

  return (
    <InputWrapper>
      {showEmoji && (
        <div>
          <Picker
            onSelect={addEmoji}
            theme={theme === lightTheme ? "light" : "dark"}
            set="apple"
            color={theme.memberNameColor}
            emojiSize={26}
            style={{
              position: "absolute",
              bottom: "100%",
              right: "0",
              color: theme.textSecondaryColor,
            }}
            showPreview={false}
            showSkinTones={false}
            title={""}
          />
        </div>
      )}

      <AddPictureBtn>
        <PictureIcon theme={theme} />
        <AddPictureInput
          type="file"
          multiple={true}
          accept="image/png, image/jpeg"
        />
      </AddPictureBtn>
      <Input
        theme={theme}
        placeholder={"Message"}
        value={content}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          const target = e.target;
          target.style.height = "40px";
          target.style.height = `${Math.min(target.scrollHeight, 160)}px`;
          setContent(target.value);
        }}
        onKeyPress={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
          if (e.key == "Enter" && !e.getModifierState("Shift")) {
            e.preventDefault();
            (e.target as HTMLTextAreaElement).style.height = "40px";
            addMessage(content);
            setContent("");
          }
        }}
      />
      <AddEmojiBtn onClick={() => setShowEmoji(!showEmoji)}>
        <EmojiIcon theme={theme} isActive={showEmoji} />
      </AddEmojiBtn>
      <AddStickerBtn>
        <StickerIcon theme={theme} />
      </AddStickerBtn>
      <AddGifBtn>
        <GifIcon theme={theme} />
      </AddGifBtn>
    </InputWrapper>
  );
}

interface ThemeProps {
  theme: Theme;
}

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 8px 6px 10px;
  position: relative;
`;

const Input = styled.textarea<ThemeProps>`
  width: 100%;
  height: 40px;
  background: ${({ theme }) => theme.inputColor};
  border-radius: 36px 16px 4px 36px;
  border: 1px solid ${({ theme }) => theme.inputColor};
  color: ${({ theme }) => theme.textPrimaryColor};
  margin-left: 10px;
  padding-top: 9px;
  padding-bottom: 9px;
  padding-left: 12px;
  padding-right: 112px;
  outline: none;
  resize: none;

  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 22px;

  &:focus {
    outline: none;
    caret-color: ${({ theme }) => theme.notificationColor};
  }
`;

const AddPictureBtn = styled.label`
  cursor: pointer;
`;

const AddPictureInput = styled.input`
  opacity: 0;
  position: absolute;
  z-index: -1;
`;

const AddEmojiBtn = styled.label`
  cursor: pointer;
  position: absolute;
  bottom: 10px;
  right: 94px;
  transform: translateX(-50%);
`;

const AddStickerBtn = styled.label`
  cursor: pointer;
  position: absolute;
  bottom: 10px;
  right: 58px;
  transform: translateX(-50%);
`;

const AddGifBtn = styled.label`
  cursor: pointer;
  position: absolute;
  bottom: 10px;
  right: 20px;
  transform: translateX(-50%);
`;
