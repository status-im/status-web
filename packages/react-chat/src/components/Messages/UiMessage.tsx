import React, { useEffect, useMemo, useState } from "react";
import { utils } from "status-communities/dist/cjs";
import styled from "styled-components";

import { useActivities } from "../../contexts/activityProvider";
import { useIdentity } from "../../contexts/identityProvider";
import { useMessengerContext } from "../../contexts/messengerProvider";
import { Reply } from "../../hooks/useReply";
import { ChannelData } from "../../models/ChannelData";
import { ChatMessage } from "../../models/ChatMessage";
import { equalDate } from "../../utils";
import { ChatMessageContent } from "../Chat/ChatMessageContent";
import { ContactMenu } from "../Form/ContactMenu";
import { Icon } from "../Icons/Icon";
import { ReactionSvg } from "../Icons/ReactionIcon";
import { ReplySvg } from "../Icons/ReplyIcon";
import { UntrustworthIcon } from "../Icons/UntrustworthIcon";
import { UserIcon } from "../Icons/UserIcon";

import { MessageQuote } from "./MessageQuote";
import {
  ContentWrapper,
  DateSeparator,
  MessageHeaderWrapper,
  MessageOuterWrapper,
  MessageText,
  MessageWrapper,
  TimeWrapper,
  UserAddress,
  UserName,
  UserNameWrapper,
} from "./Styles";

type UiMessageProps = {
  idx: number;
  message: ChatMessage;
  channel: ChannelData;
  prevMessage: ChatMessage;
  setImage: (img: string) => void;
  setLink: (link: string) => void;
  setReply: (val: Reply | undefined) => void;
  quote?: ChatMessage;
};

export function UiMessage({
  message,
  channel,
  idx,
  prevMessage,
  setImage,
  setLink,
  setReply,
  quote,
}: UiMessageProps) {
  const today = new Date();
  const { contacts } = useMessengerContext();
  const { setActivities } = useActivities();
  const identity = useIdentity();

  const contact = useMemo(
    () => contacts[message.sender],
    [message.sender, contacts]
  );
  const [showMenu, setShowMenu] = useState(false);
  const [mentioned, setMentioned] = useState(false);

  useEffect(() => {
    if (mentioned)
      setActivities((prev) => [
        ...prev,
        {
          id: message.date.getTime().toString() + message.content,
          type: "mention",
          date: message.date,
          user: message.sender,
          message: message,
          channel: channel,
        },
      ]);
    if (
      quote &&
      identity &&
      quote.sender === utils.bufToHex(identity.publicKey)
    )
      setActivities((prev) => [
        ...prev,
        {
          id: message.date.getTime().toString() + message.content,
          type: "reply",
          date: message.date,
          user: message.sender,
          message: message,
          channel: channel,
          quote: quote,
        },
      ]);
  }, [mentioned, message, quote]);

  return (
    <MessageOuterWrapper>
      {(idx === 0 || !equalDate(prevMessage.date, message.date)) && (
        <DateSeparator>
          {equalDate(message.date, today)
            ? "Today"
            : message.date.toLocaleDateString()}
        </DateSeparator>
      )}
      <MessageWrapper className={`${mentioned && "mention"}`} id={message.id}>
        <MessageQuote quote={quote} />
        <UserMessageWrapper>
          <Icon
            onClick={() => {
              setShowMenu((e) => !e);
            }}
          >
            {showMenu && (
              <ContactMenu id={message.sender} setShowMenu={setShowMenu} />
            )}
            <UserIcon />
          </Icon>
          <ContentWrapper>
            <MessageHeaderWrapper>
              <UserNameWrapper>
                <UserName>
                  {" "}
                  {contact?.customName ?? message.sender.slice(0, 10)}
                </UserName>
                {contact?.customName && (
                  <UserAddress>
                    {message.sender.slice(0, 5)}...{message.sender.slice(-3)}
                  </UserAddress>
                )}
                {contact.isUntrustworthy && <UntrustworthIcon />}
              </UserNameWrapper>
              <TimeWrapper>{message.date.toLocaleString()}</TimeWrapper>
            </MessageHeaderWrapper>
            <MessageText>
              <ChatMessageContent
                message={message}
                setImage={setImage}
                setLinkOpen={setLink}
                setMentioned={setMentioned}
              />
            </MessageText>
          </ContentWrapper>
        </UserMessageWrapper>
        <Reactions>
          <ReactionBtn>
            <ReactionSvg />
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
          </ReactionBtn>
        </Reactions>
      </MessageWrapper>
    </MessageOuterWrapper>
  );
}

const UserMessageWrapper = styled.div`
  width: 100%;
  display: flex;
`;

const Reactions = styled.div`
  display: flex;
  position: absolute;
  right: 20px;
  top: -18px;
  box-shadow: 0px 4px 12px rgba(0, 34, 51, 0.08);
  border-radius: 8px;
  background: ${({ theme }) => theme.bodyBackgroundColor};
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

  &:hover {
    background: ${({ theme }) => theme.buttonBgHover};
  }

  &:hover > svg {
    fill: ${({ theme }) => theme.tertiary};
  }
`;
