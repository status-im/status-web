import { useEffect, useMemo, useState } from "react";
import {
  Contacts as ContactsClass,
  Identity,
  Messenger,
} from "status-communities/dist/cjs";

import { Contacts } from "../../models/Contact";

export function useContacts(
  messenger: Messenger | undefined,
  identity: Identity | undefined
) {
  const [internalContacts, setInternalContacts] = useState<{
    [id: string]: number;
  }>({});

  const contactsClass = useMemo(() => {
    if (messenger) {
      const newContacts = new ContactsClass(
        identity,
        messenger.waku,
        (id, clock) => {
          setInternalContacts((prev) => {
            return { ...prev, [id]: clock };
          });
        }
      );
      return newContacts;
    }
  }, [messenger, identity]);

  const [contacts, setContacts] = useState<Contacts>({});

  useEffect(() => {
    const now = Date.now();
    setContacts((prev) => {
      const newContacts: Contacts = {};
      Object.entries(internalContacts).forEach(([id, clock]) => {
        newContacts[id] = {
          id,
          online: clock > now - 301000,
          trueName: id.slice(0, 10),
          isUntrustworthy: false,
          blocked: false,
        };
        if (prev[id]) {
          newContacts[id] = { ...prev[id], ...newContacts[id] };
        }
      });
      return newContacts;
    });
  }, [internalContacts]);

  return { contacts, setContacts, contactsClass };
}
