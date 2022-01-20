import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";

import { ChatState, useChatState } from "../../contexts/chatStateProvider";
import { useIdentity } from "../../contexts/identityProvider";
import { useMessengerContext } from "../../contexts/messengerProvider";
import { useModal } from "../../contexts/modalProvider";
import { useNarrow } from "../../contexts/narrowProvider";
import { useClickOutside } from "../../hooks/useClickOutside";
import { Reply } from "../../hooks/useReply";
import { uintToImgUrl } from "../../utils/uintToImgUrl";
import { ClearBtn } from "../Form/inputStyles";
import { ClearSvg } from "../Icons/ClearIcon";
import { ClearSvgFull } from "../Icons/ClearIconFull";
import { EmojiIcon } from "../Icons/EmojiIcon";
import { GifIcon } from "../Icons/GifIcon";
import { PictureIcon } from "../Icons/PictureIcon";
import { ReplySvg } from "../Icons/ReplyIcon";
import { StickerIcon } from "../Icons/StickerIcon";
import "emoji-mart/css/emoji-mart.css";
import { SizeLimitModal, SizeLimitModalName } from "../Modals/SizeLimitModal";
import { UserCreationStartModalName } from "../Modals/UserCreationStartModal";
import { SearchBlock } from "../SearchBlock";
import { textMediumStyles, textSmallStyles } from "../Text";

import { EmojiPicker } from "./EmojiPicker";

interface ChatInputProps {
  reply?: Reply | undefined;
  setReply?: (val: Reply | undefined) => void;
  createChat?: (group: string[]) => void;
  group?: string[];
}

export function ChatInput({
  reply,
  setReply,
  createChat,
  group,
}: ChatInputProps) {
  const narrow = useNarrow();
  const identity = useIdentity();
  const setChatState = useChatState()[1];
  const disabled = useMemo(() => !identity, [identity]);
  const { sendMessage, contacts } = useMessengerContext();
  const [content, setContent] = useState("");
  const [clearComponent, setClearComponent] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [inputHeight, setInputHeight] = useState(40);
  const [imageUint, setImageUint] = useState<undefined | Uint8Array>(undefined);

  const { setModal } = useModal(SizeLimitModalName);
  const { setModal: setCreationStartModal } = useModal(
    UserCreationStartModalName
  );

  const [query, setQuery] = useState("");

  const inputRef = useRef<HTMLDivElement>(null);

  const ref = useRef(null);
  useClickOutside(ref, () => setShowEmoji(false));

  const image = useMemo(
    () => (imageUint ? uintToImgUrl(imageUint) : ""),
    [imageUint]
  );

  const addEmoji = useCallback((e: any) => {
    const sym = e.unified.split("-");
    const codesArray: any[] = [];
    sym.forEach((el: string) => codesArray.push("0x" + el));
    const emoji = String.fromCodePoint(...codesArray);
    if (inputRef.current) {
      inputRef.current.appendChild(document.createTextNode(emoji));
    }
    setContent((p) => p + emoji);
  }, []);

  const resizeTextArea = useCallback((target: HTMLDivElement) => {
    target.style.height = "40px";
    target.style.height = `${Math.min(target.scrollHeight, 438)}px`;
    setInputHeight(target.scrollHeight);
  }, []);

  const rowHeight = inputHeight + (image ? 73 : 0);

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLDivElement>) => {
    const element = document.getSelection();
    const inputElement = inputRef.current;
    if (inputElement && element && element.rangeCount > 0) {
      const selection = element?.getRangeAt(0)?.startOffset;
      const parentElement = element.anchorNode?.parentElement;
      if (parentElement && parentElement.tagName === "B") {
        parentElement.outerHTML = parentElement.innerText;
        const range = document.createRange();
        const sel = window.getSelection();
        if (element.anchorNode.firstChild) {
          const childNumber =
            element.focusOffset === 0 ? 0 : element.focusOffset - 1;
          range.setStart(element.anchorNode.childNodes[childNumber], selection);
        }
        range.collapse(true);

        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
    const target = e.target;
    resizeTextArea(target);
    setContent(target.textContent ?? "");
  }, []);

  const onInputKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key == "Enter" && !e.getModifierState("Shift")) {
        e.preventDefault();
        (e.target as HTMLDivElement).style.height = "40px";
        setInputHeight(40);
        sendMessage(content, imageUint, reply?.id);
        setImageUint(undefined);
        setClearComponent("");
        if (inputRef.current) {
          inputRef.current.innerHTML = "";
        }
        setContent("");
        if (setReply) setReply(undefined);
        if (createChat && group) {
          createChat(group);
          setChatState(ChatState.ChatBody);
        }
      }
    },
    [content, imageUint]
  );

  const [selectedElement, setSelectedElement] = useState<{
    element: Selection | null;
    start: number;
    end: number;
    text: string;
    node: Node | null;
  }>({ element: null, start: 0, end: 0, text: "", node: null });

  const handleCursorChange = useCallback(() => {
    const element = document.getSelection();
    if (element && element.rangeCount > 0) {
      const selection = element?.getRangeAt(0)?.startOffset;
      const text = element?.anchorNode?.textContent;
      if (selection && text) {
        const end = text.indexOf(" ", selection);
        const start = text.lastIndexOf(" ", selection - 1);
        setSelectedElement({
          element,
          start,
          end,
          text,
          node: element.anchorNode,
        });
        const substring = text.substring(
          start > -1 ? start + 1 : 0,
          end > -1 ? end : undefined
        );
        if (substring.startsWith("@")) {
          setQuery(substring.slice(1));
        } else {
          setQuery("");
        }
      }
    }
  }, []);

  useEffect(handleCursorChange, [content]);

  const addMention = useCallback(
    (contact: string) => {
      if (inputRef?.current) {
        const { element, start, end, text, node } = selectedElement;
        if (element && text && node) {
          const firstSlice = text.slice(0, start > -1 ? start : 0);
          const secondSlice = text.slice(end > -1 ? end : content.length);
          const replaceContent = `${firstSlice} @${contact}${secondSlice}`;
          const spaceElement = document.createTextNode(" ");
          const contactElement = document.createElement("span");
          contactElement.innerText = `@${contact}`;

          if (contactElement && element.rangeCount > 0) {
            const range = element.getRangeAt(0);
            range.setStart(node, start > -1 ? start : 0);
            if (end === -1 || end > text.length) {
              range.setEnd(node, text.length);
            } else {
              range.setEnd(node, end);
            }
            range.deleteContents();
            if (end === -1) {
              range.insertNode(spaceElement.cloneNode());
            }
            range.insertNode(contactElement);
            if (start > -1) {
              range.insertNode(spaceElement.cloneNode());
            }
            range.collapse();
          }
          inputRef.current.focus();
          setQuery("");
          setContent(replaceContent);
          resizeTextArea(inputRef.current);
        }
      }
    },
    [inputRef, inputRef?.current, content, selectedElement]
  );

  return (
    <View className={`${createChat && "creation"}`}>
      <SizeLimitModal />
      <AddPictureInputWrapper>
        <PictureIcon />
        <AddPictureInput
          disabled={disabled}
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
                setModal(true);
              }
            }
          }}
        />
      </AddPictureInputWrapper>
      <InputArea>
        {reply && (
          <ReplyWrapper>
            <ReplyTo>
              {" "}
              <ReplySvg width={18} height={18} className="input" />{" "}
              {contacts[reply.sender]?.customName ??
                contacts[reply.sender].trueName}
            </ReplyTo>
            <ReplyOn>{reply.content}</ReplyOn>
            {reply.image && <ImagePreview src={reply.image} />}
            <CloseButton
              onClick={() => {
                if (setReply) setReply(undefined);
              }}
            >
              {" "}
              <ClearSvg width={20} height={20} className="input" />
            </CloseButton>
          </ReplyWrapper>
        )}
        <Row style={{ height: `${rowHeight}px` }}>
          <InputWrapper>
            {image && (
              <ImageWrapper>
                <ImagePreview src={image} />
                <ClearImgBtn onClick={() => setImageUint(undefined)}>
                  <ClearSvgFull width={20} height={20} />
                </ClearImgBtn>
              </ImageWrapper>
            )}
            {narrow && !identity ? (
              <JoinBtn onClick={() => setCreationStartModal(true)}>
                Click here to join discussion
              </JoinBtn>
            ) : (
              <Input
                aria-disabled={disabled}
                contentEditable={!disabled}
                onInput={onInputChange}
                onKeyDown={onInputKeyPress}
                onKeyUp={handleCursorChange}
                ref={inputRef}
                onClick={handleCursorChange}
                dangerouslySetInnerHTML={{
                  __html: disabled
                    ? "You need to join this community to send messages"
                    : clearComponent,
                }}
                className={`${disabled && "disabled"} `}
              />
            )}
            {query && (
              <SearchBlock
                query={query}
                discludeList={[]}
                onClick={addMention}
                onBotttom
              />
            )}
          </InputWrapper>
          <InputButtons>
            <EmojiWrapper ref={ref}>
              <ChatButton
                onClick={() => {
                  if (!disabled) setShowEmoji(!showEmoji);
                }}
                disabled={disabled}
              >
                <EmojiIcon isActive={showEmoji} />
              </ChatButton>
              <EmojiPicker
                addEmoji={addEmoji}
                showEmoji={showEmoji}
                bottom={rowHeight - 24}
              />
            </EmojiWrapper>
            <ChatButton disabled={disabled}>
              <StickerIcon />
            </ChatButton>
            <ChatButton disabled={disabled}>
              <GifIcon />
            </ChatButton>
          </InputButtons>
        </Row>
      </InputArea>
    </View>
  );
}

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`;

const EmojiWrapper = styled.div`
  position: relative;
`;

const View = styled.div`
  display: flex;
  align-items: flex-end;
  padding: 6px 8px 6px 10px;
  position: relative;

  &.creation {
    padding: 0;
  }
`;

const InputArea = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 438px;
  padding: 2px;
  background: ${({ theme }) => theme.inputColor};
  border-radius: 16px 16px 4px 16px;
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
  align-self: flex-end;

  button + button {
    margin-left: 4px;
  }
`;

const ImageWrapper = styled.div`
  width: 64px;
  position: relative;
`;
const ImagePreview = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 16px 16px 4px 16px;
  margin-left: 8px;
  margin-top: 9px;
`;

const ClearImgBtn = styled(ClearBtn)`
  width: 24px;
  height: 24px;
  top: 4px;
  right: -20px;
  transform: none;
  padding: 0;
  border: 2px solid ${({ theme }) => theme.inputColor};
  background-color: ${({ theme }) => theme.inputColor};
`;

const Input = styled.div`
  display: block;
  width: 100%;
  height: 40px;
  max-height: 438px;
  overflow: auto;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  padding: 8px 0 8px 12px;
  background: ${({ theme }) => theme.inputColor};
  border: 1px solid ${({ theme }) => theme.inputColor};
  color: ${({ theme }) => theme.primary};
  border-radius: 16px 16px 4px 16px;
  outline: none;

  ${textMediumStyles};

  &.disabled {
    color: ${({ theme }) => theme.secondary};
    cursor: default;
  }

  &:focus {
    outline: none;
    caret-color: ${({ theme }) => theme.notificationColor};
  }

  &::-webkit-scrollbar {
    width: 0;
  }

  & > span {
    display: inline;
    color: ${({ theme }) => theme.mentionColor};
    background: ${({ theme }) => theme.mentionBg};
    border-radius: 4px;
    font-weight: 500;
    position: relative;
    padding: 0 2px;
    cursor: pointer;

    &:hover {
      background: ${({ theme }) => theme.mentionBgHover};
      cursor: default;
    }
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

  & > input[type="file"]::-webkit-file-upload-button {
    cursor: pointer;
  }

  & > input:disabled::-webkit-file-upload-button {
    cursor: default;
  }
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

  &:disabled {
    cursor: default;
  }
`;

const CloseButton = styled(ChatButton)`
  position: absolute;
  top: 0;
  right: 0;
`;

const ReplyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.1);
  color: ${({ theme }) => theme.primary};
  border-radius: 14px 14px 4px 14px;
  position: relative;
`;

export const ReplyTo = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  ${textSmallStyles};
`;

export const ReplyOn = styled.div`
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  ${textSmallStyles};
`;

const JoinBtn = styled.button`
  color: ${({ theme }) => theme.secondary};
  background: ${({ theme }) => theme.inputColor};
  border: none;
  outline: none;
  padding: 0 10px;
  text-align: start;

  ${textMediumStyles};
`;
