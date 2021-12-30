import React, { useCallback, useState } from "react";
import { bufToHex } from "status-communities/dist/cjs/utils";
import styled from "styled-components";

import { ChatState, useChatState } from "../../contexts/chatStateProvider";
import { useIdentity } from "../../contexts/identityProvider";
import { useMessengerContext } from "../../contexts/messengerProvider";
import { ChannelData } from "../../models/ChannelData";
import { buttonStyles } from "../Buttons/buttonStyle";
import { CrossIcon } from "../Icons/CrossIcon";
import { Member } from "../Members/Member";
import { SearchBlock } from "../SearchBlock";
import { textMediumStyles } from "../Text";
interface ChatCreationProps {
  setEditGroup?: (val: boolean) => void;
  activeChannel?: ChannelData;
}

export function ChatCreation({
  setEditGroup,
  activeChannel,
}: ChatCreationProps) {
  const identity = useIdentity();
  const [query, setQuery] = useState("");
  const [styledGroup, setStyledGroup] = useState<string[]>(
    activeChannel?.members?.map(
      (member) => member?.customName ?? member.trueName
    ) ?? []
  );
  const { contacts, createGroupChat, addMembers, setChannel } =
    useMessengerContext();
  const setChatState = useChatState()[1];

  const addMember = useCallback(
    (member: string) => {
      setStyledGroup((prevMembers: string[]) => {
        if (prevMembers.find((mem) => mem === member)) {
          return prevMembers;
        } else {
          return [...prevMembers, member];
        }
      });
    },
    [setStyledGroup, styledGroup]
  );
  const removeMember = (member: string) => {
    setStyledGroup((prev) => prev.filter((e) => e != member));
  };

  const createChat = (group: string[]) => {
    if (identity) {
      const newGroup = group.slice();
      newGroup.push(bufToHex(identity.publicKey));
      group.length > 1
        ? createGroupChat(newGroup)
        : setChannel({
            id: newGroup[0],
            name: newGroup[0],
            type: "dm",
            description: `Chatkey: ${newGroup[0]} `,
          });
      setChatState(ChatState.ChatBody);
    }
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
                    query={query}
                    discludeList={styledGroup}
                    onClick={addMember}
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
          onClick={() => {
            if (!activeChannel) {
              createChat(styledGroup);
            } else {
              addMembers(styledGroup, activeChannel.id);
            }
            setEditGroup?.(false);
          }}
        >
          Confirm
        </CreationBtn>
      </CreationBar>
      {!setEditGroup && !query && (
        <Contacts>
          <ContactsHeading>Contacts</ContactsHeading>
          <ContactsList>
            {identity &&
              Object.values(contacts)
                .filter(
                  (e) =>
                    e.id != bufToHex(identity.publicKey) &&
                    !styledGroup.includes(e.id)
                )
                .map((contact) => (
                  <Member
                    key={contact.id}
                    contact={contact}
                    isOnline={contact.online}
                    onClick={() => addMember(contact.id)}
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
  width: 100%;
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
  flex: 1;
`;

const LimitAlert = styled.p`
  text-transform: uppercase;
  margin-left: auto;
  color: ${({ theme }) => theme.redColor};
`;
