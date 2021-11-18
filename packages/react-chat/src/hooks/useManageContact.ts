import { useCallback, useMemo } from "react";

import { useMessengerContext } from "../contexts/messengerProvider";

export function useManageContact(id: string) {
  const { contacts, setContacts } = useMessengerContext();
  const contact = useMemo(() => contacts[id], [id, contacts]);

  const setCustomName = useCallback(
    (customName: string | undefined) => {
      setContacts((prev) => {
        const prevUser = prev[id];
        if (!prevUser) return prev;
        return { ...prev, [id]: { ...prevUser, customName } };
      });
    },
    [id]
  );

  const setBlocked = useCallback(
    (blocked: boolean) => {
      setContacts((prev) => {
        const prevUser = prev[id];
        if (!prevUser) return prev;
        return { ...prev, [id]: { ...prevUser, blocked } };
      });
    },
    [id]
  );

  const setIsUntrustworthy = useCallback(
    (isUntrustworthy: boolean) => {
      setContacts((prev) => {
        const prevUser = prev[id];
        if (!prevUser) return prev;
        return { ...prev, [id]: { ...prevUser, isUntrustworthy } };
      });
    },
    [id]
  );
  return { contact, setCustomName, setBlocked, setIsUntrustworthy };
}
