import React, { useState } from "react";
import styled from "styled-components";

import { ChannelData } from "../../models/ChannelData";
import { CommunityData } from "../../models/CommunityData";
import { buttonStyles } from "../Buttons/buttonStyle";
import { Channel } from "../Channels/Channel";
import { CrossIcon } from "../Icons/CrossIcon";
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
        return [...prevMembers, member.slice(0, 10)];
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
                  <StyledName>{member}</StyledName>
                  <CloseButton onClick={() => removeMember(member)}>
                    <CrossIcon memberView={true} />
                  </CloseButton>
                </StyledMember>
              ))}
            </StyledList>
          )}
          <SearchMembers>
            <Input
              value={query}
              onInput={(e) => setQuery(e.currentTarget.value)}
            />
            {query && (
              <SearchContacts>
                <ContactsList>
                  {community.membersList
                    .filter((member) => member.includes(query))
                    .map((member) => (
                      <Channel
                        key={member}
                        channel={{
                          id: member,
                          name: member.slice(0, 10),
                        }}
                        isActive={false}
                        isMuted={false}
                        onClick={() => addMember(member)}
                      />
                    ))}
                </ContactsList>
              </SearchContacts>
            )}
          </SearchMembers>
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

const ContactsList = styled.div`
  display: flex;
  flex-direction: column;
`;

const SearchMembers = styled.div`
  position: relative;
`;

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
