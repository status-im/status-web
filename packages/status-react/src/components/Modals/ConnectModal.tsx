import QRCode from 'qrcode.react'
import React from 'react'

import { CopyInput } from '../Form/CopyInput'

import { Heading, MiddleSection, QRWrapper, Section, Text } from './ModalStyle'

export const ConnectModalName = 'ConnectModal'

interface ConnectModalProps {
  name: string
  address: string
  text: string
}

export function ConnectModal({ name, address, text }: ConnectModalProps) {
  return (
    <>
      <Section>
        <Heading>Connect with {name}</Heading>
      </Section>
      <MiddleSection>
        <Text>{text}</Text>
        <QRWrapper>
          {' '}
          <QRCode value={address} size={224} />
        </QRWrapper>
        <CopyInput value="2Ef1907d50926...6dt4cEbd975aC5E0Ba" />
      </MiddleSection>
    </>
  )
}
