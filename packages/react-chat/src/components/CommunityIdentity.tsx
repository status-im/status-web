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
      <Logo
        style={{
          backgroundImage: communityData?.icon
            ? `url(${communityData?.icon}`
            : "",
        }}
      >
        {" "}
        {communityData?.icon === undefined &&
          communityData?.name.slice(0, 1).toUpperCase()}
      </Logo>
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

const Logo = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  margin-right: 8px;
  background-color: ${({ theme }) => theme.tertiary};
  background-size: cover;
  background-repeat: no-repeat;
  color: ${({ theme }) => theme.iconTextColor};
  font-weight: bold;
  font-size: 15px;
  line-height: 20px;
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
