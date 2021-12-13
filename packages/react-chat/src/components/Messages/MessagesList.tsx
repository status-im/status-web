import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import { useMessengerContext } from "../../contexts/messengerProvider";
import { useModal } from "../../contexts/modalProvider";
import { useChatScrollHandle } from "../../hooks/useChatScrollHandle";
import { Reply } from "../../hooks/useReply";
import { EmptyChannel } from "../Channels/EmptyChannel";
import { LoadingIcon } from "../Icons/LoadingIcon";
import { LinkModal, LinkModalName } from "../Modals/LinkModal";
import { PictureModal, PictureModalName } from "../Modals/PictureModal";

import { UiMessage } from "./UiMessage";

interface MessagesListProps {
  setReply: (val: Reply | undefined) => void;
}

export function MessagesList({ setReply }: MessagesListProps) {
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
        <UiMessage
          key={message.id}
          message={message}
          channel={activeChannel}
          idx={idx}
          prevMessage={shownMessages[idx - 1]}
          setLink={setLink}
          setImage={setImage}
          setReply={setReply}
          quote={shownMessages.find((msg) => msg.id == message?.responseTo)}
        />
      ))}
    </MessagesWrapper>
  );
}

const LoadingWrapper = styled.div`
  display: flex;
  align-self: center;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.bodyBackgroundColor};
  position: relative;
`;

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
