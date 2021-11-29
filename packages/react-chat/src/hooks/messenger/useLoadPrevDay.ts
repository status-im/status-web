import { useCallback, useEffect, useRef, useState } from "react";
import { GroupChats, Messenger } from "status-communities/dist/cjs";

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

export function useLoadPrevDay(
  chatId: string,
  messenger: Messenger | undefined,
  groupChats?: GroupChats
) {
  const loadingPreviousMessages = useRef<{
    [chatId: string]: boolean;
  }>({});
  const lastLoadTime = useRef<{
    [chatId: string]: Date;
  }>({});
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    setLoadingMessages(loadingPreviousMessages.current[chatId]);
  }, [chatId]);

  const loadPrevDay = useCallback(
    async (id: string, groupChat?: boolean) => {
      if (messenger) {
        const endTime = lastLoadTime.current[id] ?? new Date();
        const startTime = new Date(endTime.getTime() - _MS_PER_DAY);
        const timeDiff = Math.floor(
          (new Date().getTime() - endTime.getTime()) / _MS_PER_DAY
        );
        if (timeDiff < 28) {
          if (!loadingPreviousMessages.current[id]) {
            loadingPreviousMessages.current[id] = true;
            setLoadingMessages(true);
            let amountOfMessages = 0;
            if (groupChat && groupChats) {
              amountOfMessages = await groupChats.retrievePreviousMessages(
                id,
                startTime,
                endTime
              );
            } else {
              amountOfMessages = await messenger.retrievePreviousMessages(
                id,
                startTime,
                endTime
              );
            }
            lastLoadTime.current[id] = startTime;
            loadingPreviousMessages.current[id] = false;
            setLoadingMessages(false);
            if (amountOfMessages === 0) {
              loadPrevDay(id, groupChat);
            }
          }
        }
      }
    },
    [messenger]
  );
  return { loadingMessages, loadPrevDay };
}
