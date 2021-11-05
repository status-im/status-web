import React from "react";
import styled from "styled-components";

import { useMessengerContext } from "../../contexts/messengerProvider";

interface NarrowTopbarProps {
  list: string;
}

export function NarrowTopbar({ list }: NarrowTopbarProps) {
  const { communityData } = useMessengerContext();
  return (
    <TopbarWrapper>
      <Heading>{list}</Heading>
      <SubHeading>{communityData?.name}</SubHeading>
    </TopbarWrapper>
  );
}

const TopbarWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  background-color: ${({ theme }) => theme.bodyBackgroundColor};
  padding: 14px 0;
`;

const Heading = styled.p`
  font-weight: 500;
  color: ${({ theme }) => theme.primary};
`;

const SubHeading = styled.p`
  font-weight: 500;
  color: ${({ theme }) => theme.secondary};
`;
