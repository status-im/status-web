import React, { useState } from "react";
import styled from "styled-components";

import { CommunityData } from "../../models/CommunityData";
import { buttonStyles } from "../Buttons/buttonStyle";
import { Channel } from "../Channels/Channel";
import { textMediumStyles } from "../Text";
interface ChatCreationProps {
  community: CommunityData;
}

export function ChatCreation({ community }: ChatCreationProps) {
  const [group, setGroup] = useState<string[]>([]);

  //   const onInputChange = useCallback(
  //     (e: React.ChangeEventHandler<HTMLInputElement>) => {
  //       const target = e.target;
  //       setGroup(target.value);
  //     },
  //     []
  //   );

  return (
    <CreationWrapper>
      <CreationBar>
        <InputText>To:</InputText>
        <Input
          value={group}
          onInput={(e) => setGroup([...e.currentTarget.value.split(",")])}
        />
        <CreationBtn disabled={group.length === 0}>Create</CreationBtn>
      </CreationBar>
      <Contacts>
        <ContactsHeading>Contacts</ContactsHeading>
        <ContactsList>
          {community.membersList.map((member) => (
            <Channel
              key={member}
              channel={{
                id: member,
                name: member.slice(0, 10),
                description: "Contact",
              }}
              isActive={false}
              isMuted={false}
            />
          ))}
        </ContactsList>
      </Contacts>
    </CreationWrapper>
  );
}

const CreationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${({ theme }) => theme.bodyBackgroundColor};
  padding: 8px 16px;
  margin-bottom: 32px;
`;

const CreationBar = styled.div`
  display: flex;
  position: relative;
`;

const Input = styled.input`
  flex: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.inputColor};
  border: 1px solid ${({ theme }) => theme.inputColor};
  border-radius: 8px;
  outline: none;
  resize: none;
  padding: 8px 16px 8px 45px;

  ${textMediumStyles}

  &:focus {
    outline: none;
    caret-color: ${({ theme }) => theme.notificationColor};
  }
`;

const InputText = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  color: ${({ theme }) => theme.secondary};
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
