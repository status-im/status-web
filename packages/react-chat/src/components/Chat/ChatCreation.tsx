import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";

import { ChatState, useChatState } from "../../contexts/chatStateProvider";
import { useUserPublicKey } from "../../contexts/identityProvider";
import { useMessengerContext } from "../../contexts/messengerProvider";
import { useNarrow } from "../../contexts/narrowProvider";
import { ChannelData } from "../../models/ChannelData";
import { ActivityButton } from "../ActivityCenter/ActivityButton";
import { BackButton } from "../Buttons/BackButton";
import { buttonStyles } from "../Buttons/buttonStyle";
import { CrossIcon } from "../Icons/CrossIcon";
import { Member } from "../Members/Member";
import { SearchBlock } from "../SearchBlock";
import { textMediumStyles } from "../Text";

import { ChatInput } from "./ChatInput";

interface ChatCreationProps {
  setEditGroup?: (val: boolean) => void;
  activeChannel?: ChannelData;
}

export function ChatCreation({
  setEditGroup,
  activeChannel,
}: ChatCreationProps) {
  const narrow = useNarrow();
  const userPK = useUserPublicKey();
  const [query, setQuery] = useState("");
  const [groupChatMembersIds, setGroupChatMembersIds] = useState<string[]>(
    activeChannel?.members?.map((member) => member.id) ?? []
  );
  const { contacts, createGroupChat, addMembers } = useMessengerContext();

  const groupChatMembers = useMemo(
    () => groupChatMembersIds.map((id) => contacts[id]).filter((e) => !!e),
    [groupChatMembersIds, contacts]
  );

  const setChatState = useChatState()[1];

  const addMember = useCallback(
    (member: string) => {
      setGroupChatMembersIds((prevMembers: string[]) => {
        if (
          prevMembers.find((mem) => mem === member) ||
          prevMembers.length >= 5
        ) {
          return prevMembers;
        } else {
          return [...prevMembers, member];
        }
      });
      setQuery("");
    },
    [setGroupChatMembersIds]
  );
  const removeMember = useCallback(
    (member: string) => {
      setGroupChatMembersIds((prev) => prev.filter((e) => e != member));
    },
    [setGroupChatMembersIds]
  );

  const createChat = useCallback(
    (group: string[]) => {
      if (userPK) {
        const newGroup = group.slice();
        newGroup.push(userPK);
        createGroupChat(newGroup);
        setChatState(ChatState.ChatBody);
      }
    },
    [userPK, createGroupChat, setChatState]
  );

  const handleCreationClick = useCallback(() => {
    if (!activeChannel) {
      createChat(groupChatMembers.map((member) => member.id));
    } else {
      addMembers(
        groupChatMembers.map((member) => member.id),
        activeChannel.id
      );
    }
    setEditGroup?.(false);
  }, [activeChannel, groupChatMembers, createChat, addMembers, setEditGroup]);

  return (
    <CreationWrapper className={`${narrow && "narrow"}`}>
      <CreationBar
        className={`${groupChatMembers.length === 5 && narrow && "limit"}`}
      >
        {narrow && (
          <BackButton
            onBtnClick={() =>
              setEditGroup
                ? setEditGroup?.(false)
                : setChatState(ChatState.ChatBody)
            }
            className="narrow"
          />
        )}
        <Column>
          <InputBar>
            <InputText>To:</InputText>
            <StyledList>
              {groupChatMembers.map((member) => (
                <StyledMember key={member.id}>
                  <StyledName>
                    {member?.customName?.slice(0, 10) ??
                      member.trueName.slice(0, 10)}
                  </StyledName>
                  <CloseButton onClick={() => removeMember(member.id)}>
                    <CrossIcon memberView={true} />
                  </CloseButton>
                </StyledMember>
              ))}
            </StyledList>
            {groupChatMembers.length < 5 && (
              <SearchMembers>
                <Input
                  value={query}
                  onInput={(e) => setQuery(e.currentTarget.value)}
                />
              </SearchMembers>
            )}
            {!narrow && groupChatMembers.length === 5 && (
              <LimitAlert>5 user Limit reached</LimitAlert>
            )}
          </InputBar>
          {narrow && groupChatMembers.length === 5 && (
            <LimitAlert className="narrow">5 user Limit reached</LimitAlert>
          )}
        </Column>
        <CreationBtn
          disabled={groupChatMembers.length === 0}
          onClick={handleCreationClick}
        >
          Confirm
        </CreationBtn>
        {!narrow && <ActivityButton className="creation" />}
        <SearchBlock
          query={query}
          discludeList={groupChatMembersIds}
          onClick={addMember}
        />
      </CreationBar>
      {!setEditGroup &&
        groupChatMembers.length === 0 &&
        Object.keys(contacts).length > 0 && (
          <Contacts>
            <ContactsHeading>Contacts</ContactsHeading>
            <ContactsList>
              {userPK &&
                !query &&
                Object.values(contacts)
                  .filter(
                    (e) => e.id != userPK && !groupChatMembersIds.includes(e.id)
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
      {!setEditGroup && Object.keys(contacts).length === 0 && (
        <EmptyContacts>
          <EmptyContactsHeading>
            You only can send direct messages to your Contacts.{" "}
          </EmptyContactsHeading>
          <EmptyContactsHeading>
            {" "}
            Send a contact request to the person you would like to chat with,
            you will be able to chat with them once they have accepted your
            contact request.
          </EmptyContactsHeading>
        </EmptyContacts>
      )}

      {!activeChannel && (
        <ChatInput
          createChat={createChat}
          group={groupChatMembers.map((member) => member.id)}
        />
      )}
    </CreationWrapper>
  );
}

const CreationWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  background-color: ${({ theme }) => theme.bodyBackgroundColor};
  padding: 8px 16px;

  &.narrow {
    width: 100%;
    max-width: 100%;
  }
`;

const CreationBar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  position: relative;
  &.limit {
    align-items: flex-start;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-right: 16px;
  overflow-x: hidden;
`;

const InputBar = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 44px;
  background-color: ${({ theme }) => theme.inputColor};
  border: 1px solid ${({ theme }) => theme.inputColor};
  border-radius: 8px;
  padding: 6px 16px;

  ${textMediumStyles}
`;

const Input = styled.input`
  width: 100%;
  min-width: 20px;
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
  ${buttonStyles}

  &:disabled {
    background: ${({ theme }) => theme.inputColor};
    color: ${({ theme }) => theme.secondary};
  }
`;

const StyledList = styled.div`
  display: flex;
  overflow-x: scroll;
  margin-right: 8px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const StyledMember = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 4px 4px 8px;
  background: ${({ theme }) => theme.tertiary};
  color: ${({ theme }) => theme.bodyBackgroundColor};
  border-radius: 8px;

  & + & {
    margin-left: 8px;
  }
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
  height: calc(100% - 44px);
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: auto;
`;

const ContactsHeading = styled.p`
  color: ${({ theme }) => theme.secondary};

  ${textMediumStyles}
`;

export const ContactsList = styled.div`
  display: flex;
  flex-direction: column;
`;

const EmptyContacts = styled(Contacts)`
  justify-content: center;
  align-items: center;
`;

const EmptyContactsHeading = styled(ContactsHeading)`
  max-width: 550px;
  margin-bottom: 24px;
  text-align: center;
`;

const SearchMembers = styled.div`
  position: relative;
  flex: 1;
`;

const LimitAlert = styled.p`
  text-transform: uppercase;
  margin-left: auto;
  color: ${({ theme }) => theme.redColor};
  white-space: nowrap;

  &.narrow {
    margin: 8px 0 0;
  }
`;
