import React from "react";
import styled from "styled-components";

import { Theme } from "../styles/themes";

import { textMediumStyles } from "./Text";

export interface CommunityIdentityProps {
  icon: string;
  name: string;
  subtitle: string;
  theme: Theme;
  className?: string;
}

export const CommunityIdentity = ({
  icon,
  name,
  subtitle,
  className,
  theme,
}: CommunityIdentityProps) => {
  return (
    <Row className={className}>
      <Logo src={icon} alt={`${name} logo`} />
      <div>
        <Name theme={theme}>{name}</Name>
        <Subtitle theme={theme}>{subtitle}</Subtitle>
      </div>
    </Row>
  );
};

const Row = styled.div`
  display: flex;
`;

const Logo = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 8px;
`;

const Name = styled.p`
  font-weight: 500;
  color: ${({ theme }) => theme.primary};

  ${textMediumStyles}
`;

const Subtitle = styled.p`
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.1px;
  color: ${({ theme }) => theme.secondary};
`;
