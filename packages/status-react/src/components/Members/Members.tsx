import React, { useMemo } from "react";
import styled from "styled-components";

import { useMessengerContext } from "../../contexts/messengerProvider";

import { MembersList } from "./MembersList";

export function Members() {
  const { activeChannel } = useMessengerContext();
  const heading = useMemo(
    () =>
      activeChannel && activeChannel?.type === "group"
        ? "Group members"
        : "Members",
    [activeChannel]
  );

  return (
    <MembersWrapper>
      <MemberHeading>{heading}</MemberHeading>
      <MembersList />
    </MembersWrapper>
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
