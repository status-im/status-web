import React from "react";
import styled from "styled-components";

import { useMessengerContext } from "../contexts/messengerProvider";

import { textMediumStyles } from "./Text";

export interface CommunityIdentityProps {
  subtitle: string;
  className?: string;
}

export const CommunityIdentity = ({
  subtitle,
  className,
}: CommunityIdentityProps) => {
  const { communityData } = useMessengerContext();
  return (
    <Row className={className}>
      <Logo src={communityData?.icon} alt={`${communityData?.name} logo`} />
      <Column>
        <Name>{communityData?.name}</Name>
        <Subtitle>{subtitle}</Subtitle>
      </Column>
    </Row>
  );
};

const Row = styled.div`
  display: flex;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Logo = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 8px;
`;

const Name = styled.p`
  font-family: "Inter", sans-serif;
  font-weight: 500;
  text-align: left;
  color: ${({ theme }) => theme.primary};

  ${textMediumStyles}
`;

const Subtitle = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.1px;
  color: ${({ theme }) => theme.secondary};
`;
