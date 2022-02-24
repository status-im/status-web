import React from 'react'

import { useMessengerContext } from '../../contexts/messengerProvider'
import { useModal } from '../../contexts/modalProvider'
import { ButtonNo } from '../Buttons/buttonStyle'
import { Modal } from './Modal'
import { ButtonSection, Heading, Section, Text } from './ModalStyle'

export const LeavingModalName = 'LeavingModal'

export const LeavingModal = () => {
  const { setModal } = useModal(LeavingModalName)
  const { activeChannel, removeChannel } = useMessengerContext()

  if (activeChannel)
    return (
      <Modal name={LeavingModalName}>
        <Section>
          <Heading>
            {activeChannel.type === 'dm' ? 'Delete chat' : 'Leave group'}
          </Heading>
        </Section>
        <Section>
          <Text>
            Are you sure you want to{' '}
            {activeChannel.type === 'dm'
              ? 'delete this chat'
              : 'leave this group'}
            ?
          </Text>
        </Section>
        <ButtonSection>
          <ButtonNo
            onClick={() => {
              removeChannel(activeChannel.id)
              setModal(false)
            }}
          >
            {activeChannel.type === 'dm' ? 'Delete' : 'Leave'}
          </ButtonNo>
        </ButtonSection>
      </Modal>
    )
  else {
    return null
  }
}
