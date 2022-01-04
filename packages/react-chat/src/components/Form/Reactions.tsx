import React from "react";
import styled from "styled-components";

import { Reply } from "../../hooks/useReply";
import { ChatMessage } from "../../models/ChatMessage";
import { ReactionSvg } from "../Icons/ReactionIcon";
import { ReplySvg } from "../Icons/ReplyIcon";

import { Tooltip } from "./Tooltip";

interface ReactionsProps {
  message: ChatMessage;
  showReactions: boolean;
  setShowReactions: (val: boolean) => void;
  setReply: (val: Reply | undefined) => void;
}

export function Reactions({
  message,
  showReactions,
  setShowReactions,
  setReply,
}: ReactionsProps) {
  return (
    <Wrapper>
      <ReactionBtn onClick={() => setShowReactions(!showReactions)}>
        <ReactionSvg width={22} height={22} />
        <Tooltip tip="Add reaction" />
      </ReactionBtn>
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

const ReactionBtn = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  align-self: center;
  position: relative;

  &:hover {
    background: ${({ theme }) => theme.buttonBgHover};
  }

  &:hover > svg {
    fill: ${({ theme }) => theme.tertiary};
  }

  &:hover > div {
    visibility: visible;
  }
`;
