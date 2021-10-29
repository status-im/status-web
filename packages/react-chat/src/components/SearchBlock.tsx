import React, { useMemo } from "react";
import styled from "styled-components";

import { CommunityData } from "../models/CommunityData";

import { Channel } from "./Channels/Channel";
import { ContactsList } from "./Chat/ChatCreation";

interface SearchBlockProps {
  community: CommunityData;
  query: string;
  styledGroup: string[];
  setStyledGroup: React.Dispatch<React.SetStateAction<string[]>>;
}

export const SearchBlock = ({
  community,
  query,
  styledGroup,
  setStyledGroup,
}: SearchBlockProps) => {
  const searchList = useMemo(() => {
    return community.membersList
      .filter((member) => member.includes(query))
      .filter((member) => !styledGroup.includes(member));
  }, [query, styledGroup, community.membersList]);

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
        {community.membersList
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
