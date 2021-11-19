import React, { useMemo } from "react";
import styled from "styled-components";

import { useMessengerContext } from "../contexts/messengerProvider";

import { ContactsList } from "./Chat/ChatCreation";
import { Member } from "./Members/Member";

interface SearchBlockProps {
  query: string;
  dsicludeList: string[];
  onClick: (member: string) => void;
  onBotttom?: boolean;
}

export const SearchBlock = ({
  query,
  dsicludeList,
  onClick,
  onBotttom,
}: SearchBlockProps) => {
  const { contacts } = useMessengerContext();

  const searchList = useMemo(() => {
    return Object.values(contacts)
      .filter((member) => member.id.includes(query))
      .filter((member) => !dsicludeList.includes(member.id));
  }, [query, dsicludeList, contacts]);

  if (searchList.length === 0) {
    return null;
  }
  return (
    <SearchContacts
      style={{ [onBotttom ? "bottom" : "top"]: "calc(100% + 24px)" }}
    >
      <ContactsList>
        {Object.values(contacts)
          .filter((member) => member.id.includes(query))
          .filter((member) => !dsicludeList.includes(member.id))
          .map((member) => (
            <Member
              key={member.id}
              contact={member}
              onClick={() => onClick(member.id)}
            />
          ))}
      </ContactsList>
    </SearchContacts>
  );
};

const SearchContacts = styled.div`
  display: flex;
  flex-direction: column;
  width: 360px;
  padding: 8px;
  background-color: ${({ theme }) => theme.bodyBackgroundColor};
  box-shadow: 0px 2px 4px rgba(0, 34, 51, 0.16),
    0px 4px 12px rgba(0, 34, 51, 0.08);
  border-radius: 8px;
  position: absolute;
  left: 0;
  max-height: 200px;
  overflow: auto;
`;
