import React from "react";
import styled from "styled-components";

import { useMessengerContext } from "../../contexts/messengerProvider";
import { EthereumLogo } from "../Icons/EthereumLogo";
import { MarkerdaoLogo } from "../Icons/MarkerdaoLogo";
import { StatusIcon } from "../Icons/StatusIcon";
import { textMediumStyles } from "../Text";

export function TokenRequirement() {
  const { communityData } = useMessengerContext();
  return (
    <Wrapper>
      <Text>
        To join <span>{communityData?.name}</span> community chat you need to
        hold:
      </Text>
      <Requirement>
        <StatusIcon />
        <Amount>10 SNT</Amount>
      </Requirement>
      <Text>or</Text>
      <Row>
        <Requirement>
          <EthereumLogo />
          <Amount>1 ETH</Amount>
        </Requirement>
        <TextMiddle>and</TextMiddle>
        <Requirement>
          <MarkerdaoLogo />
          <Amount>10 MKR</Amount>
        </Requirement>
      </Row>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 24px 0 8px;
`;

const Text = styled.p`
  color: ${({ theme }) => theme.primary};
  text-align: center;
  margin-bottom: 16px;

  & > span {
    font-weight: 700;
  }

  ${textMediumStyles}
`;

const TextMiddle = styled(Text)`
  margin: 0 6px 16px;
`;

const Requirement = styled.div`
  display: flex;
  align-items: center;
  border-radius: 16px;
  padding: 2px 12px 2px 2px;
  margin-bottom: 16px;
  background: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.tertiary};

  &.denial {
    background: ${({ theme }) => theme.buttonNoBgHover};
    color: ${({ theme }) => theme.redColor};
  }
`;

const Amount = styled.p`
  font-weight: 500;
  text-transform: uppercase;
  margin-left: 6px;

  ${textMediumStyles}
`;

const Row = styled.div`
  display: flex;
  align-items: center;
`;
