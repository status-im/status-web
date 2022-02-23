import React from 'react'
import styled from 'styled-components'

import {
  useSetIdentity,
  useSetNikcname,
  useUserPublicKey,
} from '../../contexts/identityProvider'
import { useMessengerContext } from '../../contexts/messengerProvider'
import { useModal } from '../../contexts/modalProvider'
import { ButtonNo, ButtonYes } from '../Buttons/buttonStyle'
import { UserLogo } from '../Members/UserLogo'

import { Modal } from './Modal'
import { ButtonSection, Heading, Section, Text } from './ModalStyle'
import {
  EmojiKey,
  UserAddress,
  UserAddressWrapper,
  UserName,
  UserNameWrapper,
} from './ProfileModal'

export const LogoutModalName = 'LogoutModal'

export const LogoutModal = () => {
  const { setModal } = useModal(LogoutModalName)
  const logout = useSetIdentity()
  const setNickname = useSetNikcname()
  const userPK = useUserPublicKey()
  const { nickname } = useMessengerContext()

  if (userPK) {
    return (
      <Modal name={LogoutModalName}>
        <Section>
          <Heading>Disconnect</Heading>
        </Section>
        <Section>
          <Text>Do you want to disconnect your profile?</Text>
          <UserSection>
            <UserLogo
              contact={{
                id: userPK,
                customName: nickname,
                trueName: userPK,
              }}
              radius={80}
              colorWheel={[
                ['red', 150],
                ['blue', 250],
                ['green', 360],
              ]}
            />
            <UserNameWrapper className="logout">
              {' '}
              <UserName className="small">{nickname}</UserName>
            </UserNameWrapper>

            <UserAddressWrapper className="small">
              <UserAddress className="small">
                {' '}
                Chatkey: {userPK.slice(0, 10)}...
                {userPK.slice(-3)}{' '}
              </UserAddress>
            </UserAddressWrapper>
            <EmojiKey className="small">🎩🍞🥑🦍🌈📡💅🏻♣️🔔⛸👵🅱</EmojiKey>
          </UserSection>
        </Section>
        <ButtonSection>
          <ButtonNo
            onClick={() => {
              setModal(false)
              logout(undefined)
              setNickname(undefined)
            }}
          >
            Disconnect
          </ButtonNo>
          <ButtonYes
            onClick={() => {
              setModal(false)
            }}
          >
            Stay Connected
          </ButtonYes>
        </ButtonSection>
      </Modal>
    )
  }

  return null
}

const UserSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 8px 0;
`
