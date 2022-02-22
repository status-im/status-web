import { Identity, utils } from '@status-im/core'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { useNickname, useSetIdentity } from '../../contexts/identityProvider'
import { useModal } from '../../contexts/modalProvider'
import { decryptIdentity, loadEncryptedIdentity } from '../../utils'
import { buttonTransparentStyles } from '../Buttons/buttonStyle'
import { UserLogo } from '../Members/UserLogo'
import { textMediumStyles } from '../Text'

import { Modal } from './Modal'
import {
  Btn,
  ButtonSection,
  Heading,
  MiddleSection,
  Section,
  Text,
} from './ModalStyle'
import {
  EmojiKey,
  UserAddress,
  UserAddressWrapper,
  UserName,
} from './ProfileModal'
import { UserCreationModalName } from './UserCreationModal'

export const ProfileFoundModalName = 'ProfileFoundModal'

export function ProfileFoundModal() {
  const { setModal } = useModal(ProfileFoundModalName)
  const { setModal: setCreationModal } = useModal(UserCreationModalName)

  const setIdentity = useSetIdentity()
  const encryptedIdentity = useMemo(() => loadEncryptedIdentity(), [])
  const nickname = useNickname()

  const [decryptedIdentity, setDecryptedIdentity] = useState<
    Identity | undefined
  >(undefined)

  useEffect(() => {
    if (encryptedIdentity)
      (async () => {
        setDecryptedIdentity(
          await decryptIdentity(encryptedIdentity, 'noPassword')
        )
      })()
  }, [encryptedIdentity])

  if (decryptedIdentity) {
    return (
      <Modal name={ProfileFoundModalName}>
        <Section>
          <Heading>Throwaway Profile found</Heading>
        </Section>
        <MiddleSection>
          <Logo
            contact={{
              id: utils.bufToHex(decryptedIdentity.publicKey),
              customName: nickname,
              trueName: utils.bufToHex(decryptedIdentity.publicKey),
            }}
            radius={80}
            colorWheel={[
              ['red', 150],
              ['blue', 250],
              ['green', 360],
            ]}
          />

          <Name className="small">{nickname}</Name>

          <UserAddressWrapper>
            <UserAddress className="small">
              {' '}
              Chatkey: {decryptedIdentity.privateKey.slice(0, 10)}...
              {decryptedIdentity.privateKey.slice(-3)}{' '}
            </UserAddress>
          </UserAddressWrapper>
          <EmojiKeyBlock>🎩🍞🥑🦍🌈📡💅🏻♣️🔔⛸👵🅱</EmojiKeyBlock>

          <Text>
            Throwaway Profile is found in your local browser’s cache. Would you
            like to load it and use it?{' '}
          </Text>
        </MiddleSection>
        <ButtonSection>
          <SkipBtn
            onClick={() => {
              setCreationModal(true)
              setModal(false)
            }}
          >
            Skip
          </SkipBtn>
          <Btn
            onClick={() => {
              setIdentity(decryptedIdentity)
              setModal(false)
            }}
          >
            Load Throwaway Profile
          </Btn>
        </ButtonSection>
      </Modal>
    )
  } else {
    return null
  }
}

const Logo = styled(UserLogo)`
  margin-bottom: 8px;
`

const Name = styled(UserName)`
  margin-bottom: 8px;
`

const EmojiKeyBlock = styled(EmojiKey)`
  margin-bottom: 24px;
`

const SkipBtn = styled.button`
  ${buttonTransparentStyles}
  ${textMediumStyles}
`
