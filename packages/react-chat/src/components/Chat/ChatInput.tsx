import { Picker } from "emoji-mart";
import React, { useMemo, useState } from "react";
import styled from "styled-components";

import { uintToImgUrl } from "../../helpers/uintToImgUrl";
import { lightTheme, Theme } from "../../styles/themes";
import { EmojiIcon } from "../Icons/EmojiIcon";
import { GifIcon } from "../Icons/GifIcon";
import { PictureIcon } from "../Icons/PictureIcon";
import { StickerIcon } from "../Icons/StickerIcon";
import "emoji-mart/css/emoji-mart.css";

type ChatInputProps = {
  theme: Theme;
  addMessage: (message: string, image?: Uint8Array) => void;
};

export function ChatInput({ theme, addMessage }: ChatInputProps) {
  const [content, setContent] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [inputHeight, setInputHeight] = useState(40);
  const [imageUint, setImageUint] = useState<undefined | Uint8Array>(undefined);
  const image = useMemo(() => {
    if (imageUint) {
      return uintToImgUrl(imageUint);
    } else {
      return "";
    }
  }, [imageUint]);
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
            color={theme.tertiary}
            emojiSize={26}
            style={{
              position: "absolute",
              bottom: "100%",
              right: "0",
              color: theme.secondary,
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
          onChange={(e) => {
            const fileReader = new FileReader();
            fileReader.onloadend = (s) => {
              const arr = new Uint8Array(s.target?.result as ArrayBuffer);
              setImageUint(arr);
            };
            if (e?.target?.files?.[0]) {
              fileReader.readAsArrayBuffer(e.target.files[0]);
            }
          }}
        />
      </AddPictureBtn>
      <InputImageWrapper
        theme={theme}
        style={{ height: `${inputHeight + (image ? 73 : 0)}px` }}
      >
        {image && (
          <ImagePreview src={image} onClick={() => setImageUint(undefined)} />
        )}
        <Input
          theme={theme}
          placeholder={"Message"}
          value={content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const target = e.target;
            target.style.height = "40px";
            target.style.height = `${Math.min(target.scrollHeight, 160)}px`;
            setInputHeight(target.scrollHeight);
            setContent(target.value);
          }}
          onKeyPress={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key == "Enter" && !e.getModifierState("Shift")) {
              e.preventDefault();
              (e.target as HTMLTextAreaElement).style.height = "40px";
              setInputHeight(40);
              addMessage(content, imageUint);
              setImageUint(undefined);
              setContent("");
            }
          }}
        />
      </InputImageWrapper>
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

const ImagePreview = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 16px 16px 4px 16px;
  margin-left: 8px;
  margin-top: 9px;
`;

const InputImageWrapper = styled.div<ThemeProps>`
  width: 100%;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.inputColor};
  border-radius: 36px 16px 4px 36px;
  height: 40px;
  margin-right: 8px;
  margin-left: 10px;
`;

const Input = styled.textarea<ThemeProps>`
  width: 100%;
  height: 40px;
  background: ${({ theme }) => theme.inputColor};
  border: 1px solid ${({ theme }) => theme.inputColor};
  color: ${({ theme }) => theme.primary};
  border-radius: 36px 16px 4px 36px;
  outline: none;
  resize: none;

  padding-top: 9px;
  padding-bottom: 9px;
  padding-left: 12px;
  padding-right: 112px;

  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 22px;

  &:focus {
    outline: none;
    caret-color: ${({ theme }) => theme.notificationColor};
  }

  &::-webkit-scrollbar {
    width: 0;
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
