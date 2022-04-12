import React from 'react'

import { useProfile } from '~/src/protocol/use-profile'
import { Avatar, Dialog, EmojiHash, Flex, Heading, Text } from '~/src/system'

export const DisconnectDialog = () => {
  const profile = useProfile()

  return (
    <Dialog title="Disconnect">
      <Dialog.Body gap="5">
        <Text>Do you want to disconnect your profile from this browser?</Text>
        <Flex direction="column" align="center" gap="2">
          <Avatar size={64} src={profile.imageUrl} />
          <Heading weight="600">{profile.name}</Heading>
          <Text color="gray">
            Chatkey: 0x63FaC9201494f0bd17B9892B9fae4d52fe3BD377
          </Text>
          <EmojiHash />
        </Flex>
      </Dialog.Body>
      <Dialog.Actions>
        <Dialog.Cancel>Stay Connected</Dialog.Cancel>
        <Dialog.Action variant="danger">Disconnect</Dialog.Action>
      </Dialog.Actions>
    </Dialog>
  )
}
