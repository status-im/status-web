import React, { useMemo } from "react";
import styled from "styled-components";

import { useMessengerContext } from "../contexts/messengerProvider";

import { Channel } from "./Channels/Channel";
import { ContactsList } from "./Chat/ChatCreation";

interface SearchBlockProps {
  query: string;
  styledGroup: string[];
  setStyledGroup: React.Dispatch<React.SetStateAction<string[]>>;
}

export const SearchBlock = ({
  query,
  styledGroup,
  setStyledGroup,
}: SearchBlockProps) => {
  const { communityData } = useMessengerContext();

  if (!communityData) {
    return null;
  }

  const searchList = useMemo(() => {
    return communityData.membersList
      .filter((member) => member.includes(query))
      .filter((member) => !styledGroup.includes(member));
  }, [query, styledGroup, communityData.membersList]);

  const addMember = (member: string) => {
    setStyledGroup((prevMembers: string[]) => {
      if (prevMembers.find((mem) => mem === member)) {
        return prevMembers;
      } else {
        return [...prevMembers, member];
      }
    });
  };
  if (searchList.length === 0) {
    return null;
  }
  return (
    <SearchContacts>
      <ContactsList>
        {communityData.membersList
          .filter((member) => member.includes(query))
          .filter((member) => !styledGroup.includes(member))
          .map((member) => (
            <Channel
              key={member}
              channel={{
                id: member,
                name: member.slice(0, 10),
                type: "dm",
              }}
              isActive={false}
              isMuted={false}
              onClick={() => addMember(member)}
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
  top: calc(100% + 24px);
`;
