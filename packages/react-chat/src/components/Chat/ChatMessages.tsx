import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import { useBlockedUsers } from "../../contexts/blockedUsersProvider";
import { useMessengerContext } from "../../contexts/messengerProvider";
import { useModal } from "../../contexts/modalProvider";
import { useChatScrollHandle } from "../../hooks/useChatScrollHandle";
import { ChatMessage } from "../../models/ChatMessage";
import { equalDate } from "../../utils";
import { EmptyChannel } from "../Channels/EmptyChannel";
import { ContactMenu } from "../Form/ContactMenu";
import { LoadingIcon } from "../Icons/LoadingIcon";
import { UserIcon } from "../Icons/UserIcon";
import { LinkModal, LinkModalName } from "../Modals/LinkModal";
import { PictureModal, PictureModalName } from "../Modals/PictureModal";
import { textSmallStyles } from "../Text";

import { ChatMessageContent } from "./ChatMessageContent";

const today = new Date();

type ChatUiMessageProps = {
  idx: number;
  message: ChatMessage;
  prevMessage: ChatMessage;
  setImage: (img: string) => void;
  setLink: (link: string) => void;
};

function ChatUiMessage({
  message,
  idx,
  prevMessage,
  setImage,
  setLink,
}: ChatUiMessageProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <MessageOuterWrapper>
      {(idx === 0 || !equalDate(prevMessage.date, message.date)) && (
        <DateSeparator>
          {equalDate(message.date, today)
            ? "Today"
            : message.date.toLocaleDateString()}
        </DateSeparator>
      )}
      <MessageWrapper>
        <Icon onClick={() => setShowMenu((e) => !e)}>
          {showMenu && (
            <ContactMenu id={message.sender} setShowMenu={setShowMenu} />
          )}
          <UserIcon />
        </Icon>

        <ContentWrapper>
          <MessageHeaderWrapper>
            <UserNameWrapper>{message.sender.slice(0, 10)}</UserNameWrapper>
            <TimeWrapper>{message.date.toLocaleString()}</TimeWrapper>
          </MessageHeaderWrapper>
          <MessageText>
            <ChatMessageContent
              message={message}
              setImage={setImage}
              setLinkOpen={setLink}
            />
          </MessageText>
        </ContentWrapper>
      </MessageWrapper>
    </MessageOuterWrapper>
  );
}

export function ChatMessages() {
  const { messages, activeChannel } = useMessengerContext();
  const ref = useRef<HTMLHeadingElement>(null);
  const loadingMessages = useChatScrollHandle(messages, ref, activeChannel.id);

  const { blockedUsers } = useBlockedUsers();

  const shownMessages = useMemo(
    () => messages.filter((message) => !blockedUsers.includes(message.sender)),
    [blockedUsers, messages, messages.length]
  );

  const [image, setImage] = useState("");
  const [link, setLink] = useState("");

  const { setModal: setPictureModal, isVisible: showPictureModal } =
    useModal(PictureModalName);
  const { setModal: setLinkModal, isVisible: showLinkModal } =
    useModal(LinkModalName);

  useEffect(() => (!image ? undefined : setPictureModal(true)), [image]);
  useEffect(() => (!link ? undefined : setLinkModal(true)), [link]);

  useEffect(
    () => (!showPictureModal ? setImage("") : undefined),
    [showPictureModal]
  );
  useEffect(() => (!showLinkModal ? setLink("") : undefined), [showLinkModal]);

  return (
    <MessagesWrapper ref={ref}>
      <PictureModal image={image} />
      <LinkModal link={link} />
      <EmptyChannel channel={activeChannel} />
      {loadingMessages && (
        <LoadingWrapper>
          <LoadingIcon className="message" />
        </LoadingWrapper>
      )}
      {shownMessages.map((message, idx) => (
        <ChatUiMessage
          key={message.date.getTime().toString() + message.content}
          message={message}
          idx={idx}
          prevMessage={shownMessages[idx - 1]}
          setLink={setLink}
          setImage={setImage}
        />
      ))}
    </MessagesWrapper>
  );
}

const MessagesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 44px);
  overflow: auto;
  padding: 8px 16px 0;

  &::-webkit-scrollbar {
    width: 0;
  }
`;

const MessageWrapper = styled.div`
  width: 100%;
  display: flex;
  padding: 8px 0;
  margin-bottom: 8px;
`;

const MessageOuterWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const DateSeparator = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  height: 100%;
  text-align: center;
  justify-content: center;
  align-items: center;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  color: #939ba1;
  margin-top: 16px;
  margin-bottom: 16px;

  ${textSmallStyles}
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;
`;

const MessageHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const Icon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: end;
  border-radius: 50%;
  background-color: #bcbdff;
  flex-shrink: 0;
  position: relative;
`;

const UserNameWrapper = styled.div`
  font-size: 15px;
  line-height: 22px;
  color: ${({ theme }) => theme.tertiary};
`;

const TimeWrapper = styled.div`
  font-size: 10px;
  line-height: 14px;
  letter-spacing: 0.2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.secondary};
  margin-left: 4px;
`;

const MessageText = styled.div`
  overflow-wrap: anywhere;
  width: 100%;
  white-space: pre-wrap;
  color: ${({ theme }) => theme.primary};
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-self: center;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.bodyBackgroundColor};
  position: relative;
`;
