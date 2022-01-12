import React from "react";
import styled from "styled-components";

import { useMessengerContext } from "../../contexts/messengerProvider";
import { LeftIconSvg } from "../Icons/LeftIcon";

interface NarrowTopbarProps {
  list: string;
  onBtnClick: () => void;
}

export function NarrowTopbar({ list, onBtnClick }: NarrowTopbarProps) {
  const { communityData } = useMessengerContext();
  return (
    <TopbarWrapper>
      <BackBtn onClick={onBtnClick}>
        <LeftIconSvg width={24} height={24} className="black" />
      </BackBtn>
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

const BackBtn = styled.button`
  position: absolute;
  left: 0;
  top: 8px;
  width: 32px;
  height: 32px;
  padding: 0;
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
`;
