import React from 'react'

import styled from 'styled-components'

import { useMessengerContext } from '../../contexts/messengerProvider'
import { useNarrow } from '../../contexts/narrowProvider'
import { DownloadButton } from '../Buttons/DownloadButton'
import { CommunityIdentity } from '../CommunityIdentity'
import { CopyInput } from '../Form/CopyInput'
import { StatusLogo } from '../Icons/StatusLogo'
import { textSmallStyles } from '../Text'
import { Modal } from './Modal'
import { Section, Text } from './ModalStyle'

import type { CommunityIdentityProps } from '../CommunityIdentity'

export const CommunityModalName = 'CommunityModal'

type CommunityModalProps = CommunityIdentityProps

export const CommunityModal = ({ subtitle }: CommunityModalProps) => {
  const narrow = useNarrow()
  const { communityData } = useMessengerContext()
  return (
    <Modal name={CommunityModalName}>
      <Section>
        <CommunityIdentity subtitle={subtitle} />
      </Section>
      <Section>
        <Text>{communityData?.description}</Text>
      </Section>
      <Section>
        <CopyInput
          value={communityData?.id ?? ''}
          label="Community public key"
        />
        <Hint>
          To access this community, paste community public key in Status desktop
          or mobile app.
          {narrow && <StyledDownloadButton />}
        </Hint>
      </Section>
      {!narrow && (
        <BottomSection>
          <StatusLogo />
          <DownloadButton />
        </BottomSection>
      )}
    </Modal>
  )
}

const BottomSection = styled(Section)`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledDownloadButton = styled(DownloadButton)`
  display: inline;
  padding: 0;
  margin-left: 4px;
  background: none;
  font-size: 13px;
  line-height: 18px;
  text-decoration: underline;
  color: ${({ theme }) => theme.secondary};
`

const Hint = styled.p`
  margin-top: 16px;
  color: ${({ theme }) => theme.secondary};

  ${textSmallStyles}
`
