import React, { useMemo, useState } from "react";
import styled from "styled-components";

import { MembersList } from "../../components/Members/MembersList";
import { useMessengerContext } from "../../contexts/messengerProvider";

export function GroupMembers() {
  const { addContact, activeChannel } = useMessengerContext();
  const heading = useMemo(
    () =>
      activeChannel && activeChannel?.type === "group"
        ? "Group members"
        : "Members",
    [activeChannel]
  );
  const [newUserInput, setNewUserInput] = useState("");
  return (
    <>
      <MembersWrapper>
        <MemberHeading>{heading}</MemberHeading>
        <MembersList />
        <input
          value={newUserInput}
          onChange={(e) => setNewUserInput(e.target.value)}
        />
        <button onClick={() => addContact(newUserInput)}>Add Contact</button>
      </MembersWrapper>
    </>
  );
}

const MembersWrapper = styled.div`
  width: 18%;
  height: 100%;
  min-width: 164px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.sectionBackgroundColor};
  padding: 16px;
  overflow-y: scroll;
`;

const MemberHeading = styled.h2`
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 16px;
`;
