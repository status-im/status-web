import React, { useState } from "react";
import styled from "styled-components";

import { ChannelData } from "../../models/ChannelData";
import { CommunityData } from "../../models/CommunityData";
import { buttonStyles } from "../Buttons/buttonStyle";
import { Channel } from "../Channels/Channel";
import { CrossIcon } from "../Icons/CrossIcon";
import { SearchBlock } from "../SearchBlock";
import { textMediumStyles } from "../Text";
interface ChatCreationProps {
  community: CommunityData;
  setMembersList: any;
  setActiveChannel: (val: ChannelData) => void;
  setCreateChat: (val: boolean) => void;
}

export function ChatCreation({
  community,
  setMembersList,
  setActiveChannel,
  setCreateChat,
}: ChatCreationProps) {
  const [query, setQuery] = useState("");
  const [styledGroup, setStyledGroup] = useState<string[]>([]);

  const addMember = (member: string) => {
    setStyledGroup((prevMembers: string[]) => {
      if (prevMembers.find((mem) => mem === member)) {
        return prevMembers;
      } else {
        return [...prevMembers, member];
      }
    });
  };

  const removeMember = (member: string) => {
    const idx = styledGroup.indexOf(member);
    styledGroup.splice(idx, 1);
  };

  const createChat = (group: string[]) => {
    setMembersList(group);
    setActiveChannel({
      id: group.join(""),
      name: group.join(", "),
      type: "group",
    });
    setCreateChat(false);
  };

  return (
    <CreationWrapper>
      <CreationBar>
        <InputBar>
          <InputText>To:</InputText>
          {styledGroup.length > 0 && (
            <StyledList>
              {styledGroup.map((member) => (
                <StyledMember key={member}>
                  <StyledName>{member.slice(0, 10)}</StyledName>
                  <CloseButton onClick={() => removeMember(member)}>
                    <CrossIcon memberView={true} />
                  </CloseButton>
                </StyledMember>
              ))}
            </StyledList>
          )}
          <SearchMembers>
            {styledGroup.length < 5 && (
              <>
                <Input
                  value={query}
                  onInput={(e) => setQuery(e.currentTarget.value)}
                />
                {query && (
                  <SearchBlock
                    community={community}
                    query={query}
                    styledGroup={styledGroup}
                    setStyledGroup={setStyledGroup}
                  />
                )}
              </>
            )}
          </SearchMembers>
          {styledGroup.length === 5 && (
            <LimitAlert>5 user Limit reached</LimitAlert>
          )}
        </InputBar>
        <CreationBtn
          disabled={styledGroup.length === 0}
          onClick={() => createChat(styledGroup)}
        >
          Confirm
        </CreationBtn>
      </CreationBar>
      {!query && styledGroup.length === 0 && (
        <Contacts>
          <ContactsHeading>Contacts</ContactsHeading>
          <ContactsList>
            {community.membersList.map((member) => (
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
        </Contacts>
      )}
    </CreationWrapper>
  );
}

const CreationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${({ theme }) => theme.bodyBackgroundColor};
  padding: 8px 16px;
`;

const CreationBar = styled.div`
  display: flex;
  margin-bottom: 32px;
`;

const InputBar = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.inputColor};
  border: 1px solid ${({ theme }) => theme.inputColor};
  border-radius: 8px;
  padding: 8px 16px;

  ${textMediumStyles}
`;

const Input = styled.input`
  background-color: ${({ theme }) => theme.inputColor};
  border: 1px solid ${({ theme }) => theme.inputColor};
  outline: none;
  resize: none;

  ${textMediumStyles}

  &:focus {
    outline: none;
    caret-color: ${({ theme }) => theme.notificationColor};
  }
`;

const InputText = styled.div`
  color: ${({ theme }) => theme.secondary};
  margin-right: 8px;
`;

const CreationBtn = styled.button`
  padding: 11px 24px;
  margin-left: 16px;
  ${buttonStyles}

  &:disabled {
    background: ${({ theme }) => theme.inputColor};
    color: ${({ theme }) => theme.secondary};
  }
`;

const StyledList = styled.div`
  display: flex;
`;

const StyledMember = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 4px 4px 8px;
  background: ${({ theme }) => theme.tertiary};
  color: ${({ theme }) => theme.bodyBackgroundColor};
  border-radius: 8px;
  margin-right: 8px;
`;

const StyledName = styled.p`
  color: ${({ theme }) => theme.bodyBackgroundColor};

  ${textMediumStyles}
`;

const CloseButton = styled.button`
  width: 20px;
  height: 20px;
`;

const Contacts = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContactsHeading = styled.p`
  color: ${({ theme }) => theme.secondary};

  ${textMediumStyles}
`;

export const ContactsList = styled.div`
  display: flex;
  flex-direction: column;
`;

const SearchMembers = styled.div`
  position: relative;
`;

const LimitAlert = styled.p`
  text-transform: uppercase;
  margin-left: auto;
  color: ${({ theme }) => theme.redColor};
`;
