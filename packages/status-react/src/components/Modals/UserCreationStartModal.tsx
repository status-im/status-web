import React from 'react'

import styled from 'styled-components'

import { UserCreationButtons } from '../UserCreation/UserCreationButtons'
import { Modal } from './Modal'
import { Heading, Section } from './ModalStyle'

export const UserCreationStartModalName = 'UserCreationStartModal'

export const UserCreationStartModal = () => {
  return (
    <Modal name={UserCreationStartModalName}>
      <Section>
        <Heading>Jump into the discussion</Heading>
      </Section>
      <MiddleSection>
        <UserCreationButtons permission={true} />
      </MiddleSection>
    </Modal>
  )
}

const MiddleSection = styled(Section)`
  padding: 48px 0;
`
