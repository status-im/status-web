import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Theme } from "../../styles/themes";

/* eslint-disable no-useless-escape */
const regEx =
  /(?:(?:http|https):\/\/)?(?:[-a-z0-9]+\.)+[a-z]+(?::\d+)?(?:(?:\/[-\+~%/\.\w]+)?\/?(?:[&?][-\+=&;%@\.\w]+)?(?:#[\w]+)?)?/gi;
/* eslint-enable no-useless-escape */

type ChatMessageContentProps = {
  content: string;
  theme: Theme;
};

export function ChatMessageContent({
  content,
  theme,
}: ChatMessageContentProps) {
  const [elements, setElements] = useState<(string | React.ReactElement)[]>([
    content,
  ]);

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
      setElements(newSplit);
    }
  }, [content]);

  return <>{elements.map((el) => el)}</>;
}

const Link = styled.a`
  text-decoration: underline;
  color: ${({ theme }) => theme.memberNameColor};
`;
