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
  const [link, setLink] = useState<string | undefined>(undefined)
  const [ openGraph , setOpenGraph ] = useState<{'og:site_name':string, 'og:title':string, 'og:image':string} | undefined>(undefined)

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
      const match = matches[0]
      const link =
          match.startsWith("http://") || match.startsWith("https://")
              ? match
              : "https://" + match;
      setLink(link)
      setElements(newSplit);
    }
  }, [content]);

    useEffect(() => {
        const updatePreview = async () => {
            if (link) {
                const response = await fetch('https://localhost:3000',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ 'site': link })
                    })
                const body = await response.text()
                console.log(body)
                try{
                    const parsedBody = JSON.parse(body)
                    if('og:image' in parsedBody && 'og:site_name' in parsedBody && 'og:title' in parsedBody){
                        setOpenGraph(JSON.parse(body))
                    }
                } catch{

                }
            }
        }
        updatePreview()
    }, [link])
    if(openGraph){
        return (
            <ContentWrapper>
                <div>{elements.map((el) => el)}</div>
                <img src={openGraph["og:image"]}/>
            </ContentWrapper>
        )
    } else {
        return <>{elements.map((el) => el)}</>;
    }
}



const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
`

const Link = styled.a`
  text-decoration: underline;
  color: ${({ theme }) => theme.memberNameColor};
`;
