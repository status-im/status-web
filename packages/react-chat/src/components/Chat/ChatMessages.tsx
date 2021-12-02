import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import { useMessengerContext } from "../../contexts/messengerProvider";
import { useModal } from "../../contexts/modalProvider";
import { useChatScrollHandle } from "../../hooks/useChatScrollHandle";
import { ChatMessage } from "../../models/ChatMessage";
import { equalDate } from "../../utils";
import { EmptyChannel } from "../Channels/EmptyChannel";
import { ContactMenu } from "../Form/ContactMenu";
import { LoadingIcon } from "../Icons/LoadingIcon";
import { ReactionSvg } from "../Icons/ReactionIcon";
import { ReplySvg } from "../Icons/ReplyIcon";
import { UntrustworthIcon } from "../Icons/UntrustworthIcon";
import { UserIcon } from "../Icons/UserIcon";
import { LinkModal, LinkModalName } from "../Modals/LinkModal";
import { PictureModal, PictureModalName } from "../Modals/PictureModal";
import { textMediumStyles, textSmallStyles } from "../Text";

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
  const { contacts } = useMessengerContext();
  const contact = useMemo(
    () => contacts[message.sender],
    [message.sender, contacts]
  );
  const [showMenu, setShowMenu] = useState(false);
  const [mentioned, setMentioned] = useState(false);

  return (
    <MessageOuterWrapper>
      {(idx === 0 || !equalDate(prevMessage.date, message.date)) && (
        <DateSeparator>
          {equalDate(message.date, today)
            ? "Today"
            : message.date.toLocaleDateString()}
        </DateSeparator>
      )}
      <MessageWrapper className={`${mentioned && "mention"}`}>
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
                {contact.customName ?? message.sender.slice(0, 10)}
              </UserName>
              {contact.customName && (
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
        <Reactions>
          <ReactionBtn>
            <ReactionSvg />
          </ReactionBtn>
          <ReactionBtn>
            <ReplySvg />
          </ReactionBtn>
        </Reactions>
      </MessageWrapper>
    </MessageOuterWrapper>
  );
}

export function ChatMessages() {
  const { messages, activeChannel, contacts } = useMessengerContext();
  const ref = useRef<HTMLHeadingElement>(null);
  const loadingMessages = useChatScrollHandle(messages, ref, activeChannel);

  const shownMessages = useMemo(
    () =>
      messages.filter(
        (message) => !contacts?.[message.sender]?.blocked ?? true
      ),
    [contacts, messages, messages.length]
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
  padding: 8px 0;

  &::-webkit-scrollbar {
    width: 0;
  }
`;

const MessageWrapper = styled.div`
  width: 100%;
  display: flex;
  padding: 8px 16px;
  border-left: 2px solid ${({ theme }) => theme.bodyBackgroundColor};
  position: relative;

  &:hover {
    background: ${({ theme }) => theme.inputColor};
    border-color: ${({ theme }) => theme.inputColor};
  }

  &:hover > div {
    visibility: visible;
  }

  &.mention {
    background: ${({ theme }) => theme.mentionBg};
    border-color: ${({ theme }) => theme.mentionColor};
  }

  &.mention:hover {
    background: ${({ theme }) => theme.mentionBgHover};
    border-color: ${({ theme }) => theme.mentionColor};
  }
`;

const MessageOuterWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const DateSeparator = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  height: 100%;
  text-align: center;
  justify-content: center;
  align-items: center;
  font-family: "Inter";
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
  background-size: contain;
  background-position: center;
  flex-shrink: 0;
  position: relative;
  cursor: pointer;
`;

const UserNameWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const UserName = styled.p`
  color: ${({ theme }) => theme.tertiary};
  margin-right: 4px;

  ${textMediumStyles}
`;

export const UserAddress = styled.p`
  font-size: 10px;
  line-height: 14px;
  letter-spacing: 0.2px;
  color: ${({ theme }) => theme.secondary};
  position: relative;
  padding-right: 8px;

  &:after {
    content: "";
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: ${({ theme }) => theme.secondary};
  }
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
