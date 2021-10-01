import { decode } from "html-entities";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Metadata } from "../../models/Metadata";
import { Theme } from "../../styles/themes";

/* eslint-disable no-useless-escape */
const regEx =
  /(?:(?:http|https):\/\/)?(?:[-a-z0-9]+\.)+[a-z]+(?::\d+)?(?:(?:\/[-\+~%/\.\w]+)?\/?(?:[&?][-\+=&;%@\.\w]+)?(?:#[\w]+)?)?/gi;
/* eslint-enable no-useless-escape */

type ChatMessageContentProps = {
  content: string;
  theme: Theme;
  fetchMetadata?: (url: string) => Promise<Metadata | undefined>;
};

export function ChatMessageContent({
  content,
  theme,
  fetchMetadata,
}: ChatMessageContentProps) {
  const [elements, setElements] = useState<(string | React.ReactElement)[]>([
    content,
  ]);
  const [link, setLink] = useState<string | undefined>(undefined);
  const [openGraph, setOpenGraph] = useState<Metadata | undefined>(undefined);

  useEffect(() => {
    const split = content.split(regEx);
    const newSplit: (string | React.ReactElement)[] = [split[0]];
    const matches = content.match(regEx);
    if (matches) {
      matches.forEach((match, idx) => {
        const link =
          match.startsWith("http://") || match.startsWith("https://")
            ? match
            : "https://" + match;
        newSplit.push(
          <Link
            key={idx}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            theme={theme}
          >
            {match}
          </Link>,
          split[idx + 1]
        );
      });
      const match = matches[0];
      const link =
        match.startsWith("http://") || match.startsWith("https://")
          ? match
          : "https://" + match;
      setLink(link);
      setElements(newSplit);
    }
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
  if (openGraph) {
    return (
      <ContentWrapper>
        <div>{elements.map((el) => el)}</div>
        <PreviewWrapper
          onClick={() => window?.open(link, "_blank", "noopener")?.focus()}
        >
          <PreviewImage src={decodeURI(decode(openGraph["og:image"]))} />
          <PreviewTitleWrapper>{openGraph["og:title"]}</PreviewTitleWrapper>
          <PreviewSiteNameWrapper>
            {openGraph["og:site_name"]}
          </PreviewSiteNameWrapper>
        </PreviewWrapper>
      </ContentWrapper>
    );
  } else {
    return <>{elements.map((el) => el)}</>;
  }
}

const PreviewSiteNameWrapper = styled.div`
  font-family: Inter;
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
  font-size: 13px;
  width: 290px;
  line-height: 18px;
  margin-left: 12px;
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

const Link = styled.a`
  text-decoration: underline;
  color: ${({ theme }) => theme.memberNameColor};
`;
