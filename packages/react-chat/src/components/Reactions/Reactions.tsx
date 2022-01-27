import { utils } from "@waku/status-communities/dist/cjs";
import { BaseEmoji } from "emoji-mart";
import React from "react";
import styled from "styled-components";

import { useIdentity } from "../../contexts/identityProvider";
import { Reply } from "../../hooks/useReply";
import { ChatMessage } from "../../models/ChatMessage";
import { Tooltip } from "../Form/Tooltip";
import { DeleteIcon } from "../Icons/DeleteIcon";
import { EditIcon } from "../Icons/EditIcon";
import { PinIcon } from "../Icons/PinIcon";
import { ReplySvg } from "../Icons/ReplyIcon";

import { ReactionBtn, ReactionButton } from "./ReactionButton";

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
  const identity = useIdentity();

  const userMessage =
    identity && message.sender === utils.bufToHex(identity.publicKey);

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
      {userMessage && (
        <ReactionBtn>
          <EditIcon width={22} height={22} className="grey" />
          <Tooltip tip="Edit" />
        </ReactionBtn>
      )}
      <ReactionBtn>
        <PinIcon width={22} height={22} />
        <Tooltip tip="Pin" />
      </ReactionBtn>
      {userMessage && (
        <ReactionBtn className="red">
          <DeleteIcon width={22} height={22} className="grey" />
          <Tooltip tip="Delete" />
        </ReactionBtn>
      )}
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
