import { useCallback, useEffect, useState } from "react";

import { useMessengerContext } from "../contexts/messengerProvider";
import { ChatMessage } from "../models/ChatMessage";

export function useScrollToMessage() {
  const scrollToDivId = useCallback((id: string) => {
    const quoteDiv = document.getElementById(id);
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
  }, []);

  const { activeChannel, channelsDispatch } = useMessengerContext();
  const [scrollToMessage, setScrollToMessage] = useState("");
  const [messageChannel, setMessageChannel] = useState("");

  useEffect(() => {
    if (scrollToMessage && messageChannel) {
      if (activeChannel?.id === messageChannel) {
        scrollToDivId(scrollToMessage);
        setScrollToMessage("");
        setMessageChannel("");
      }
    }
  }, [activeChannel, scrollToMessage, messageChannel]);

  const scroll = useCallback((msg: ChatMessage, channelId?: string) => {
    if (!channelId) {
      scrollToDivId(msg.id);
    } else {
      setMessageChannel(channelId);
      setScrollToMessage(msg.id);
      channelsDispatch({ type: "ChangeActive", payload: channelId });
    }
  }, []);

  return scroll;
}
