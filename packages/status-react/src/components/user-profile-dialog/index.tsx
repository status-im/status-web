import React from 'react'

import { Avatar, Dialog, EmojiHash, Heading, Text } from '../../system'

import type { Member } from '../../protocol'

interface Props {
  member: Member
}

// TODO: Add all states of contact, wait for desktop release
export const UserProfileDialog = (props: Props) => {
  const { member, ...dialogProps } = props

  const { username, colorHash, chatKey } = member

  return (
    <Dialog title={`${username}'s Profile`} size="640" {...dialogProps}>
      <Dialog.Body align="center">
        <Avatar size="80" name={username} colorHash={colorHash} />
        <Heading size="22">{username}</Heading>
        <Text>Chatkey: {chatKey}</Text>
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
