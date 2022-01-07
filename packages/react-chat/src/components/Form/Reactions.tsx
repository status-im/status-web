import { BaseEmoji } from "emoji-mart";
import React from "react";
import styled from "styled-components";

import { Reply } from "../../hooks/useReply";
import { ChatMessage } from "../../models/ChatMessage";
import { ReplySvg } from "../Icons/ReplyIcon";

import { ReactionBtn, ReactionButton } from "./ReactionButton";
import { Tooltip } from "./Tooltip";

interface ReactionsProps {
  message: ChatMessage;
  setReply: (val: Reply | undefined) => void;
  messageReactions: BaseEmoji[];
  setMessageReactions: React.Dispatch<React.SetStateAction<BaseEmoji[]>>;
}

export function Reactions({
  message,
  setReply,
  messageReactions,
  setMessageReactions,
}: ReactionsProps) {
  return (
    <Wrapper>
      <ReactionButton
        messageReactions={messageReactions}
        setMessageReactions={setMessageReactions}
      />
      <ReactionBtn
        onClick={() =>
          setReply({
            sender: message.sender,
            content: message.content,
            image: message.image,
            id: message.id,
          })
        }
      >
        <ReplySvg width={22} height={22} />
        <Tooltip tip="Reply" />
      </ReactionBtn>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  position: absolute;
  right: 20px;
  top: -18px;
  box-shadow: 0px 4px 12px rgba(0, 34, 51, 0.08);
  border-radius: 8px;
  background: ${({ theme }) => theme.bodyBackgroundColor};
  padding: 2px;
  visibility: hidden;
`;
