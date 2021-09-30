import React, { useEffect, useState } from "react";

/* eslint-disable no-useless-escape */
const regEx =
  /(?:(?:http|https):\/\/)?(?:[-a-z0-9]+\.)+[a-z]+(?::\d+)?(?:(?:\/[-\+~%/\.\w]+)?\/?(?:[&?][-\+=&;%@\.\w]+)?(?:#[\w]+)?)?/gi;
/* eslint-enable no-useless-escape */

type ChatMessageContentProps = {
  content: string;
};

export function ChatMessageContent({ content }: ChatMessageContentProps) {
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
          <a key={idx} href={link}>
            {match}
          </a>,
          split[idx + 1]
        );
      });
      setElements(newSplit);
    }
  }, [content]);

  return <>{elements.map((el) => el)}</>;
}
