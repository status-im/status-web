import React from "react";
import styled from "styled-components";

interface NarrowTopbarProps {
  list: string;
  community: string;
}

export function NarrowTopbar({ list, community }: NarrowTopbarProps) {
  return (
    <TopbarWrapper>
      <Heading>{list}</Heading>
      <SubHeading>{community}</SubHeading>
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
