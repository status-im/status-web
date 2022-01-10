import { BaseEmoji, Emoji, getEmojiDataFromNative } from "emoji-mart";
import data from "emoji-mart/data/all.json";
import React, { useCallback } from "react";
import styled from "styled-components";

const emojiHeart = getEmojiDataFromNative("❤️", "twitter", data);
const emojiLike = getEmojiDataFromNative("👍", "twitter", data);
const emojiDislike = getEmojiDataFromNative("👎", "twitter", data);
const emojiLaughing = getEmojiDataFromNative("😆", "twitter", data);
const emojiDisappointed = getEmojiDataFromNative("😥", "twitter", data);
const emojiRage = getEmojiDataFromNative("😡", "twitter", data);

const emojiArr = [
  emojiHeart,
  emojiLike,
  emojiDislike,
  emojiLaughing,
  emojiDisappointed,
  emojiRage,
];

interface ReactionPickerProps {
  className?: string;
  messageReactions: BaseEmoji[];
  setMessageReactions: React.Dispatch<React.SetStateAction<BaseEmoji[]>>;
}

export function ReactionPicker({
  className,
  messageReactions,
  setMessageReactions,
}: ReactionPickerProps) {
  const handleReaction = useCallback(
    (emoji: BaseEmoji) => {
      messageReactions.find((e) => e === emoji)
        ? setMessageReactions((prev) => prev.filter((e) => e != emoji))
        : setMessageReactions((prev) => [...prev, emoji]);
    },
    [messageReactions]
  );

  return (
    <Wrapper className={className}>
      {emojiArr.map((emoji) => (
        <EmojiBtn
          key={emoji.id}
          onClick={() => handleReaction(emoji)}
          className={`${messageReactions.includes(emoji) && "chosen"}`}
        >
          {" "}
          <Emoji
            emoji={emoji}
            set={"twitter"}
            skin={emoji.skin || 1}
            size={32}
          />
        </EmojiBtn>
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 266px;
  display: flex;
  justify-content: space-between;
  position: absolute;
  right: -34px;
  top: -60px;
  background: ${({ theme }) => theme.bodyBackgroundColor};
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 16px 16px 4px 16px;
  padding: 8px;

  &.small {
    right: unset;
    left: -100px;
    transform: none;
    border-radius: 16px 16px 16px 4px;
  }
`;

const EmojiBtn = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;

  &:hover {
    background: ${({ theme }) => theme.inputColor};
  }

  &.chosen {
    background: ${({ theme }) => theme.reactionBg};
    border: 1px solid ${({ theme }) => theme.tertiary};
  }
`;
