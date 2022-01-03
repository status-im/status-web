import React from "react";
import styled from "styled-components";

import { useMessengerContext } from "../../contexts/messengerProvider";
// import { EthereumLogo } from "../Icons/EthereumLogo";
// import { MarkerdaoLogo } from "../Icons/MarkerdaoLogo";
import { StatusIcon } from "../Icons/StatusIcon";
import { textMediumStyles } from "../Text";

const communityRequirements = {
  requirements: [
    {
      name: "STN",
      amount: 10,
    },
  ],
  alternativeRequirements: [
    {
      name: "ETH",
      amount: 1,
    },
    {
      name: "MKR",
      amount: 10,
    },
  ],
};

export function TokenRequirement() {
  const { communityData } = useMessengerContext();
  return (
    <Wrapper>
      <Text>
        To join <span>{communityData?.name}</span> community chat you need to
        hold:
      </Text>
      <Row>
        {communityRequirements.requirements.map((req) => (
          <Requirement>
            <StatusIcon />
            <Amount>
              {req.amount} {req.name}{" "}
            </Amount>
          </Requirement>
        ))}
      </Row>
      {communityRequirements.alternativeRequirements && <Text>or</Text>}
      <Row>
        {communityRequirements.alternativeRequirements.map((req) => (
          <Requirement>
            <StatusIcon />
            <Amount>
              {req.amount} {req.name}{" "}
            </Amount>
          </Requirement>
        ))}
      </Row>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 50%;
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

const Requirement = styled.div`
  display: flex;
  align-items: center;
  border-radius: 16px;
  padding: 2px 12px 2px 2px;
  background: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.tertiary};

  &.denial {
    background: ${({ theme }) => theme.buttonNoBgHover};
    color: ${({ theme }) => theme.redColor};
  }

  & + & {
    margin-left: 18px;
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
  margin-bottom: 16px;
`;
