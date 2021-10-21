import { useCallback, useState } from "react";

export function useNotifications() {
  const [notifications, setNotifications] = useState<{
    [chatId: string]: number;
  }>({});
  const incNotification = useCallback((id: string) => {
    setNotifications((prevNotifications) => {
      return {
        ...prevNotifications,
        [id]: (prevNotifications?.[id] ?? 0) + 1,
      };
    });
  }, []);
  const clearNotifications = useCallback((id: string) => {
    setNotifications((prevNotifications) => {
      return {
        ...prevNotifications,
        [id]: 0,
      };
    });
  }, []);
  return { notifications, incNotification, clearNotifications };
}
