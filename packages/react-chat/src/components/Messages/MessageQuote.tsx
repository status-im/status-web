import React, { useCallback } from "react";
import styled from "styled-components";

import { ChatMessage } from "../../models/ChatMessage";
import { ReplyOn, ReplyTo } from "../Chat/ChatInput";
import { QuoteSvg } from "../Icons/QuoteIcon";
import { UserIcon } from "../Icons/UserIcon";

function calcHeight(quote: ChatMessage) {
  if (quote.image && quote.content) {
    return 88;
  } else if (quote.image && !quote.content) {
    return 68;
  } else {
    return 25;
  }
}

type MessageQuoteProps = {
  quote: ChatMessage | undefined;
};

export function MessageQuote({ quote }: MessageQuoteProps) {
  const quoteClick = useCallback(() => {
    if (quote) {
      const quoteDiv = document.getElementById(quote.id);
      if (quoteDiv) {
        quoteDiv.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
        quoteDiv.style.background = "lightblue";
        quoteDiv.style.transition = "background-color 1000ms linear";
        window.setTimeout(() => {
          quoteDiv.style.background = "";
          window.setTimeout(() => {
            quoteDiv.style.transition = "";
          }, 1000);
        }, 1000);
      }
    }
  }, [quote]);

  if (quote) {
    return (
      <QuoteWrapper onClick={quoteClick}>
        <QuoteSvg width={22} height={calcHeight(quote)} />
        <QuoteSender>
          {" "}
          <UserIcon memberView={true} /> {quote.sender}
        </QuoteSender>
        <Quote>{quote.content}</Quote>
        {quote.image && <QuoteImage src={quote.image} />}
      </QuoteWrapper>
    );
  }
  return null;
}

const QuoteWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 48px;
  position: relative;
`;

const QuoteSender = styled(ReplyTo)`
  color: ${({ theme }) => theme.secondary};
`;

const Quote = styled(ReplyOn)`
  color: ${({ theme }) => theme.secondary};
`;

const QuoteImage = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 4px;
  margin-top: 4px;
`;
