import React from 'react'

import { Avatar, Dialog, EmojiHash, Heading, Text } from '~/src/system'

interface Props {
  name: string
}

// TODO: Add all states of contact, wait for desktop release
export const UserProfileDialog = (props: Props) => {
  const { name, ...dialogProps } = props

  return (
    <Dialog title={`${name}'s Profile`} size="640" {...dialogProps}>
      <Dialog.Body align="center">
        <Avatar size="80" />
        <Heading size="22">{name}</Heading>
        <Text>Chatkey: 0x63FaC9201494f0bd17B9892B9fae4d52fe3BD377</Text>
        <EmojiHash />
      </Dialog.Body>
      <Dialog.Actions>
        <Dialog.Action variant="danger">Remove Contact</Dialog.Action>
        <Dialog.Action variant="danger">Mark Untrustworthy</Dialog.Action>
        <Dialog.Action>Send Contact Request</Dialog.Action>
      </Dialog.Actions>
    </Dialog>
  )
}
