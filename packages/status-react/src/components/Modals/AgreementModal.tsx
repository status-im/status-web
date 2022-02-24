import HCaptcha from '@hcaptcha/react-hcaptcha'
import React, { useState } from 'react'

import styled, { useTheme } from 'styled-components'

import { useMessengerContext } from '../../contexts/messengerProvider'
import { useModal } from '../../contexts/modalProvider'
import { lightTheme } from '../../styles/themes'
import { Logo } from '../CommunityIdentity'
import { textMediumStyles } from '../Text'
import { Modal } from './Modal'
import { Btn, ButtonSection, Heading, Section, Text } from './ModalStyle'

import type { Theme } from '../../styles/themes'

export const AgreementModalName = 'AgreementModal'

export function AgreementModal() {
  const theme = useTheme() as Theme
  const { communityData } = useMessengerContext()
  const { setModal } = useModal(AgreementModalName)

  const [checked, setChecked] = useState(false)
  const [token, setToken] = useState('')

  return (
    <Modal name={AgreementModalName} className="wide">
      <Section>
        <Heading>Welcome to {communityData?.name}</Heading>
      </Section>
      <Section>
        <LogoWrapper>
          <CommunityLogo
            style={{
              backgroundImage: communityData?.icon
                ? `url(${communityData?.icon}`
                : '',
            }}
          >
            {' '}
            {communityData?.icon === undefined &&
              communityData?.name.slice(0, 1).toUpperCase()}
          </CommunityLogo>
        </LogoWrapper>
        <AgreementSection>
          <Text>{communityData?.description}</Text>
        </AgreementSection>
        <Agreements>
          <Agreement>
            <AgreementInput
              type="checkbox"
              name="agreement"
              value="user agreement"
              checked={checked}
              onChange={e => setChecked(e.target.checked)}
              required
            />
            <Checkmark />I agree with the above
          </Agreement>

          <form>
            <HCaptcha
              sitekey="64702fa3-7f57-41bb-bd43-7afeae54227e"
              theme={theme === lightTheme ? 'light' : 'dark'}
              onVerify={setToken}
            />
          </form>
        </Agreements>
      </Section>
      <ButtonSection>
        <Btn
          onClick={() => {
            setModal(false)
          }}
          disabled={!token || !checked}
        >
          Join {communityData?.name}
        </Btn>
      </ButtonSection>
    </Modal>
  )
}

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`

const CommunityLogo = styled(Logo)`
  width: 64px;
  height: 64px;
`

const AgreementSection = styled.div`
  margin-bottom: 24px;
`

const Agreements = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const Agreement = styled.label`
  display: flex;
  align-items: center;
  position: relative;
  color: ${({ theme }) => theme.primary};
  padding-left: 26px;
  margin-right: 48px;

  ${textMediumStyles}

  & input:checked ~ span {
    background-color: ${({ theme }) => theme.tertiary};
    border: 1px solid ${({ theme }) => theme.tertiary};
    border-radius: 2px;
  }

  & input:checked ~ span:after {
    display: block;
  }
`

const AgreementInput = styled.input`
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
`

const Checkmark = styled.span`
  position: absolute;
  top: 2px;
  left: 0;
  width: 18px;
  height: 18px;

  background-color: ${({ theme }) => theme.inputColor};
  border: 1px solid ${({ theme }) => theme.inputColor};
  border-radius: 2px;
  margin: 0 8px 0 0;

  &:after {
    content: '';
    position: absolute;
    display: none;

    left: 5px;
    top: 1px;
    width: 4px;
    height: 9px;
    border: solid ${({ theme }) => theme.bodyBackgroundColor};
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
`
