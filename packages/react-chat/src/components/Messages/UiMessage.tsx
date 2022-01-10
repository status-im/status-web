import { BaseEmoji } from "emoji-mart";
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
import { UntrustworthIcon } from "../Icons/UntrustworthIcon";
import { UserLogo } from "../Members/UserLogo";
import { Reactions } from "../Reactions/Reactions";

import { MessageQuote } from "./MessageQuote";
import { MessageReactions } from "./MessageReactions";
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
  const [messageReactions, setMessageReactions] = useState<BaseEmoji[]>([]);

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
            <UserLogo
              contact={contact}
              radius={40}
              colorWheel={[
                ["red", 150],
                ["blue", 250],
                ["green", 360],
              ]}
            />
          </Icon>
          <ContentWrapper>
            <MessageHeaderWrapper>
              <UserNameWrapper>
                <UserName> {contact?.customName ?? contact.trueName}</UserName>
                <UserAddress className="chat">
                  {message.sender.slice(0, 5)}...{message.sender.slice(-3)}
                </UserAddress>
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
            {messageReactions.length > 0 && (
              <MessageReactions
                messageReactions={messageReactions}
                setMessageReactions={setMessageReactions}
              />
            )}
          </ContentWrapper>
        </UserMessageWrapper>
        <Reactions
          message={message}
          setReply={setReply}
          messageReactions={messageReactions}
          setMessageReactions={setMessageReactions}
        />
      </MessageWrapper>
    </MessageOuterWrapper>
  );
}

const UserMessageWrapper = styled.div`
  width: 100%;
  display: flex;
`;
