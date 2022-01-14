import {
  Contacts as ContactsClass,
  Identity,
  Messenger,
} from "@waku/status-communities/dist/cjs";
import { bufToHex } from "@waku/status-communities/dist/cjs/utils";
import { useEffect, useMemo, useState } from "react";

import { Contacts } from "../../models/Contact";

export function useContacts(
  messenger: Messenger | undefined,
  identity: Identity | undefined,
  newNickname: string | undefined
) {
  const [nickname, setNickname] = useState<string | undefined>(undefined);
  const [internalContacts, setInternalContacts] = useState<{
    [id: string]: { clock: number; nickname?: string };
  }>({});

  const contactsClass = useMemo(() => {
    if (messenger) {
      const newContacts = new ContactsClass(
        identity,
        messenger.waku,
        (id, clock) => {
          setInternalContacts((prev) => {
            return { ...prev, [id]: { ...prev[id], clock } };
          });
        },
        (id, nickname) => {
          setInternalContacts((prev) => {
            if (identity?.publicKey && id === bufToHex(identity.publicKey)) {
              setNickname(nickname);
            }
            return { ...prev, [id]: { ...prev[id], nickname } };
          });
        },
        newNickname
      );
      return newContacts;
    }
  }, [messenger, identity]);

  const [contacts, setContacts] = useState<Contacts>({});

  useEffect(() => {
    const now = Date.now();
    setContacts((prev) => {
      const newContacts: Contacts = {};
      Object.entries(internalContacts).forEach(([id, { clock, nickname }]) => {
        newContacts[id] = {
          id,
          online: clock > now - 301000,
          trueName: nickname ?? id.slice(0, 10),
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

  return { contacts, setContacts, contactsClass, nickname };
}
