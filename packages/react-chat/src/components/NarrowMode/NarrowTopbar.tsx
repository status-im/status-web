import React from "react";
import styled from "styled-components";

import { useMessengerContext } from "../../contexts/messengerProvider";
import { BackButton } from "../Buttons/BackButton";

interface NarrowTopbarProps {
  list: string;
  onBtnClick: () => void;
}

export function NarrowTopbar({ list, onBtnClick }: NarrowTopbarProps) {
  const { communityData } = useMessengerContext();
  return (
    <TopbarWrapper>
      <BackButton onBtnClick={onBtnClick} />
      <HeadingWrapper>
        <Heading>{list}</Heading>
        <SubHeading>{communityData?.name}</SubHeading>
      </HeadingWrapper>
    </TopbarWrapper>
  );
}

const TopbarWrapper = styled.div`
  display: flex;
  justify-content: center;
  background-color: ${({ theme }) => theme.bodyBackgroundColor};
  margin-bottom: 16px;
  position: relative;
`;

const HeadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
`;

const Heading = styled.p`
  font-weight: 500;
  color: ${({ theme }) => theme.primary};
`;

const SubHeading = styled.p`
  font-weight: 500;
  color: ${({ theme }) => theme.secondary};
`;

export const ListWrapper = styled.div`
  padding: 16px;
  background: ${({ theme }) => theme.bodyBackgroundColor};
  overflow: auto;
  flex: 1;
`;
