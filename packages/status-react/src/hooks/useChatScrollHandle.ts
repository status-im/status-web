import { useEffect, useState } from "react";

import { useMessengerContext } from "../contexts/messengerProvider";
import { ChatMessage } from "../models/ChatMessage";

export function useChatScrollHandle(
  messages: ChatMessage[],
  ref: React.RefObject<HTMLHeadingElement>
) {
  const { loadPrevDay, loadingMessages, activeChannel } = useMessengerContext();
  const [scrollOnBot, setScrollOnBot] = useState(true);

  useEffect(() => {
    if (ref && ref.current && scrollOnBot) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages.length, scrollOnBot, ref]);

  useEffect(() => {
    if (activeChannel) {
      if (
        (ref?.current?.clientHeight ?? 0) >= (ref?.current?.scrollHeight ?? 0)
      ) {
        setScrollOnBot(true);
        loadPrevDay(activeChannel.id, activeChannel.type !== "channel");
      }
    }
  }, [messages.length, activeChannel, loadPrevDay, setScrollOnBot, ref]);

  useEffect(() => {
    const currentRef = ref.current;
    const setScroll = () => {
      if (ref?.current && activeChannel) {
        if (ref.current.scrollTop <= 0) {
          loadPrevDay(activeChannel.id, activeChannel.type !== "channel");
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
    currentRef?.addEventListener("scroll", setScroll);
    return () => currentRef?.removeEventListener("scroll", setScroll);
  }, [ref, scrollOnBot, activeChannel, loadPrevDay]);
  return loadingMessages;
}
