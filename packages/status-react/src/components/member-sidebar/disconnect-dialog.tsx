import React from 'react'

import { useAccount } from '~/src/protocol'
import { Avatar, Dialog, EmojiHash, Flex, Heading, Text } from '~/src/system'

export const DisconnectDialog = () => {
  const [account] = useAccount()

  return (
    <Dialog title="Disconnect">
      <Dialog.Body gap="5">
        <Text>Do you want to disconnect your profile from this browser?</Text>
        <Flex direction="column" align="center" gap="2">
          <Avatar size={64} src={account.imageUrl} />
          <Heading weight="600">{account.name}</Heading>
          <Text color="gray">
            Chatkey: {account.chatKey}
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
