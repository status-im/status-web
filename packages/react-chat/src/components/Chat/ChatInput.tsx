import { Picker } from "emoji-mart";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import { useLow } from "../../contexts/narrowProvider";
import { lightTheme, Theme } from "../../styles/themes";
import { uintToImgUrl } from "../../utils/uintToImgUrl";
import { EmojiIcon } from "../Icons/EmojiIcon";
import { GifIcon } from "../Icons/GifIcon";
import { PictureIcon } from "../Icons/PictureIcon";
import { StickerIcon } from "../Icons/StickerIcon";
import "emoji-mart/css/emoji-mart.css";
import { Modal } from "../Modals/Modal";

type ChatInputProps = {
  theme: Theme;
  addMessage: (message: string, image?: Uint8Array) => void;
};

export function ChatInput({ theme, addMessage }: ChatInputProps) {
  const [content, setContent] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [inputHeight, setInputHeight] = useState(40);
  const [imageUint, setImageUint] = useState<undefined | Uint8Array>(undefined);
  const [showSizeLimit, setShowSizeLimit] = useState(false);

  useEffect(() => {
    window.addEventListener("click", () => setShowEmoji(false));
    return () => {
      window.removeEventListener("click", () => setShowEmoji(false));
    };
  }, []);

  const image = useMemo(
    () => (imageUint ? uintToImgUrl(imageUint) : ""),
    [imageUint]
  );

  const addEmoji = useCallback((e: any) => {
    const sym = e.unified.split("-");
    const codesArray: any[] = [];
    sym.forEach((el: string) => codesArray.push("0x" + el));
    const emoji = String.fromCodePoint(...codesArray);
    setContent((p) => p + emoji);
  }, []);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const target = e.target;
      target.style.height = "40px";
      target.style.height = `${Math.min(target.scrollHeight, 438)}px`;
      setInputHeight(target.scrollHeight);
      setContent(target.value);
    },
    []
  );

  const onInputKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key == "Enter" && !e.getModifierState("Shift")) {
        e.preventDefault();
        (e.target as HTMLTextAreaElement).style.height = "40px";
        setInputHeight(40);
        addMessage(content, imageUint);
        setImageUint(undefined);
        setContent("");
      }
    },
    [content, imageUint]
  );

  const low = useLow();

  return (
    <View>
      <Modal onClose={() => setShowSizeLimit(false)} isVisible={showSizeLimit}>
        <div
          onClick={() => setShowSizeLimit(false)}
          style={{ padding: "20px" }}
        >
          File size must be less than 1MB
        </div>
      </Modal>
      {showEmoji && (
        <div>
          <Picker
            onSelect={addEmoji}
            theme={theme === lightTheme ? "light" : "dark"}
            set="twitter"
            color={theme.tertiary}
            emojiSize={26}
            style={{
              position: "absolute",
              bottom: "100%",
              right: "0",
              color: theme.secondary,
              height: low ? "200px" : "355px",
              overflow: "auto",
            }}
            showPreview={false}
            showSkinTones={false}
            title={""}
          />
        </div>
      )}

      <AddPictureInputWrapper>
        <PictureIcon />
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
              if (e.target.files[0].size < 1024 * 1024) {
                fileReader.readAsArrayBuffer(e.target.files[0]);
              } else {
                setShowSizeLimit(true);
              }
            }
          }}
        />
      </AddPictureInputWrapper>
      <Row style={{ height: `${inputHeight + (image ? 73 : 0)}px` }}>
        <InputWrapper>
          {image && (
            <ImagePreview src={image} onClick={() => setImageUint(undefined)} />
          )}
          <Input
            placeholder="Message"
            value={content}
            onChange={onInputChange}
            onKeyPress={onInputKeyPress}
          />
        </InputWrapper>
        <InputButtons>
          <ChatButton
            onClick={(e) => {
              e.stopPropagation();
              setShowEmoji(!showEmoji);
            }}
          >
            <EmojiIcon isActive={showEmoji} />
          </ChatButton>
          <ChatButton>
            <StickerIcon />
          </ChatButton>
          <ChatButton>
            <GifIcon />
          </ChatButton>
        </InputButtons>
      </Row>
    </View>
  );
}

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const View = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 8px 6px 10px;
  position: relative;
`;

const Row = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-height: 438px;
  padding-right: 6px;
  background: ${({ theme }) => theme.inputColor};
  border-radius: 16px 16px 4px 16px;
`;

const InputButtons = styled.div`
  display: flex;
  align-items: center;

  button + button {
    margin-left: 4px;
  }
`;

const ImagePreview = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 16px 16px 4px 16px;
  margin-left: 8px;
  margin-top: 9px;
`;

const Input = styled.textarea`
  width: 100%;
  height: 40px;
  max-height: 438px;
  padding: 8px 0 8px 12px;
  background: ${({ theme }) => theme.inputColor};
  border: 1px solid ${({ theme }) => theme.inputColor};
  color: ${({ theme }) => theme.primary};
  border-radius: 16px 16px 4px 16px;
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

  &::-webkit-scrollbar {
    width: 0;
  }
`;

const AddPictureInputWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  margin-right: 4px;
`;

const AddPictureInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
`;

const ChatButton = styled.button`
  width: 32px;
  height: 32px;
`;
