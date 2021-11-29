import { useEffect, useState } from "react";

import { useMessengerContext } from "../contexts/messengerProvider";
import { ChannelData } from "../models/ChannelData";
import { ChatMessage } from "../models/ChatMessage";

export function useChatScrollHandle(
  messages: ChatMessage[],
  ref: React.RefObject<HTMLHeadingElement>,
  activeChannel: ChannelData
) {
  const { loadPrevDay, loadingMessages } = useMessengerContext();
  const [scrollOnBot, setScrollOnBot] = useState(true);

  useEffect(() => {
    if (ref && ref.current && scrollOnBot) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages.length, scrollOnBot]);

  useEffect(() => {
    if (!loadingMessages) {
      if (
        (ref?.current?.clientHeight ?? 0) >= (ref?.current?.scrollHeight ?? 0)
      ) {
        setScrollOnBot(true);
        loadPrevDay(activeChannel.id, activeChannel.type === "group");
      }
    }
  }, [messages.length, loadingMessages]);

  useEffect(() => {
    const setScroll = () => {
      if (ref?.current) {
        if (ref.current.scrollTop <= 0) {
          loadPrevDay(activeChannel.id, activeChannel.type === "group");
        }
        if (
          ref.current.scrollTop + ref.current.clientHeight ==
          ref.current.scrollHeight
        ) {
          if (scrollOnBot === false) {
            setScrollOnBot(true);
          }
        } else {
          if (scrollOnBot === true) {
            setScrollOnBot(false);
          }
        }
      }
    };
    ref.current?.addEventListener("scroll", setScroll);
    return () => ref.current?.removeEventListener("scroll", setScroll);
  }, [ref, scrollOnBot]);
  return loadingMessages;
}
