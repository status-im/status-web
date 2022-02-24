import React from 'react'

import styled from 'styled-components'

import { useMessengerContext } from '../../contexts/messengerProvider'
import { textMediumStyles } from '../Text'

const communityRequirements = {
  requirements: [
    {
      name: 'STN',
      amount: 10,
      logo: 'https://status.im/img/logo.svg',
    },
  ],
  alternativeRequirements: [
    {
      name: 'ETH',
      amount: 1,
      logo: 'https://ethereum.org/static/a110735dade3f354a46fc2446cd52476/db4de/eth-home-icon.webp',
    },
    {
      name: 'MKR',
      amount: 10,
      logo: 'https://cryptologos.cc/logos/maker-mkr-logo.svg?v=017',
    },
  ],
}

export function TokenRequirement() {
  const { communityData } = useMessengerContext()
  return (
    <Wrapper>
      <Text>
        To join <span>{communityData?.name}</span> community chat you need to
        hold:
      </Text>
      <Row>
        {communityRequirements.requirements.map(req => (
          <Requirement key={req.name + req.amount}>
            <Logo
              style={{
                backgroundImage: `url(${req.logo}`,
              }}
            />
            <Amount>
              {req.amount} {req.name}{' '}
            </Amount>
          </Requirement>
        ))}
      </Row>
      {communityRequirements.alternativeRequirements && <Text>or</Text>}
      <Row>
        {communityRequirements.alternativeRequirements.map(req => (
          <Requirement key={req.name + req.amount}>
            <Logo
              style={{
                backgroundImage: `url(${req.logo}`,
              }}
            />
            <Amount>
              {req.amount} {req.name}{' '}
            </Amount>
          </Requirement>
        ))}
      </Row>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 50%;
`

const Text = styled.p`
  color: ${({ theme }) => theme.primary};
  text-align: center;
  margin-bottom: 16px;

  & > span {
    font-weight: 700;
  }

  ${textMediumStyles}
`

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
`

const Amount = styled.p`
  font-weight: 500;
  text-transform: uppercase;
  margin-left: 6px;

  ${textMediumStyles}
`

const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`

const Logo = styled.div`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  background-size: cover;
  background-repeat: no-repeat;
`
