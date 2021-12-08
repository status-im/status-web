import { decode } from "html-entities";
import React, { useEffect, useMemo, useState } from "react";
import { utils } from "status-communities/dist/cjs";
import styled from "styled-components";

import { useFetchMetadata } from "../../contexts/fetchMetadataProvider";
import { useIdentity } from "../../contexts/identityProvider";
import { useMessengerContext } from "../../contexts/messengerProvider";
import { ChatMessage } from "../../models/ChatMessage";
import { Metadata } from "../../models/Metadata";
import { ContactMenu } from "../Form/ContactMenu";
import { ImageMenu } from "../Form/ImageMenu";
import { textMediumStyles, textSmallStyles } from "../Text";

interface MentionProps {
  id: string;
  setMentioned: (val: boolean) => void;
}

function Mention({ id, setMentioned }: MentionProps) {
  const { contacts } = useMessengerContext();
  const contact = useMemo(() => contacts[id.slice(1)], [id, contacts]);
  const [showMenu, setShowMenu] = useState(false);
  const identity = useIdentity();

  if (!contact) return <>{id}</>;

  useEffect(() => {
    if (contact.id === utils.bufToHex(identity.publicKey)) setMentioned(true);
  }, [contact.id]);

  return (
    <MentionBLock onClick={() => setShowMenu(!showMenu)}>
      {`@${contact.customName ?? contact.id}`}
      {showMenu && <ContactMenu id={id.slice(1)} setShowMenu={setShowMenu} />}
    </MentionBLock>
  );
}

type ChatMessageContentProps = {
  message: ChatMessage;
  setImage: (image: string) => void;
  setLinkOpen: (link: string) => void;
  setMentioned: (val: boolean) => void;
};

export function ChatMessageContent({
  message,
  setImage,
  setLinkOpen,
  setMentioned,
}: ChatMessageContentProps) {
  const fetchMetadata = useFetchMetadata();
  const { content, image } = useMemo(() => message, [message]);
  const [elements, setElements] = useState<(string | React.ReactElement)[]>([
    content,
  ]);
  const [link, setLink] = useState<string | undefined>(undefined);
  const [openGraph, setOpenGraph] = useState<Metadata | undefined>(undefined);

  useEffect(() => {
    let link;
    const split = content.split(" ");
    const newSplit = split.flatMap((element, idx) => {
      if (element.startsWith("http://") || element.startsWith("https://")) {
        link = element;
        return [
          <Link key={idx} onClick={() => setLinkOpen(element)}>
            {element}
          </Link>,
          " ",
        ];
      }
      if (element.startsWith("@")) {
        return [
          <Mention key={idx} id={element} setMentioned={setMentioned} />,
          " ",
        ];
      }
      return [element, " "];
    });
    newSplit.pop();
    setLink(link);
    setElements(newSplit);
  }, [content]);

  useEffect(() => {
    const updatePreview = async () => {
      if (link && fetchMetadata) {
        try {
          const metadata = await fetchMetadata(link);
          if (metadata) {
            setOpenGraph(metadata);
          }
        } catch {
          return;
        }
      }
    };
    updatePreview();
  }, [link]);

  return (
    <ContentWrapper>
      <div>{elements.map((el) => el)}</div>
      {image && (
        <MessageImageWrapper>
          <MessageImage
            src={image}
            id={image}
            onClick={() => {
              setImage(image);
            }}
          />
          <ImageMenu imageId={image} />
        </MessageImageWrapper>
      )}
      {openGraph && (
        <PreviewWrapper onClick={() => setLinkOpen(link ?? "")}>
          <PreviewImage src={decodeURI(decode(openGraph["og:image"]))} />
          <PreviewTitleWrapper>{openGraph["og:title"]}</PreviewTitleWrapper>
          <PreviewSiteNameWrapper>
            {openGraph["og:site_name"]}
          </PreviewSiteNameWrapper>
        </PreviewWrapper>
      )}
    </ContentWrapper>
  );
}

const MessageImageWrapper = styled.div`
  width: 147px;
  height: 196px;
  margin-top: 8px;
  position: relative;
`;

const MessageImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
  cursor: pointer;
`;

const PreviewSiteNameWrapper = styled.div`
  font-family: "Inter";
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.1px;
  margin-top: 2px;
  color: #939ba1;
  margin-left: 12px;
`;

const PreviewTitleWrapper = styled.div`
  margin-top: 7px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  width: 290px;
  margin-left: 12px;

  ${textSmallStyles}
`;

const PreviewImage = styled.img`
  border-radius: 15px 15px 15px 4px;
  width: 305px;
  height: 170px;
`;

const PreviewWrapper = styled.div`
  margin-top: 9px;
  background: #ffffff;
  width: 305px;
  height: 224px;
  border: 1px solid #eef2f5;
  box-sizing: border-box;
  border-radius: 16px 16px 16px 4px;
  display: flex;
  flex-direction: column;
  padding: 0px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const MentionBLock = styled.div`
  display: inline-block;
  color: ${({ theme }) => theme.mentionColor};
  background: ${({ theme }) => theme.mentionBgHover};
  border-radius: 4px;
  font-weight: 500;
  position: relative;
  padding: 0 2px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.mentionHover};
  }

  ${textMediumStyles}
`;

const Link = styled.a`
  text-decoration: underline;
  cursor: pointer;
  color: ${({ theme }) => theme.memberNameColor};
`;
