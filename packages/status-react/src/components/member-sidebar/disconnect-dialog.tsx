import React from 'react'

import { useAccount } from '~/src/protocol'
import { Avatar, Dialog, EmojiHash, Flex, Heading, Text } from '~/src/system'

import type { Account } from '~/src/protocol'

interface Props {
  account: Account
}

export const DisconnectDialog = (props: Props) => {
  const { deleteAccount } = useAccount()
  const { account } = props

  return (
    <Dialog title="Disconnect">
      <Dialog.Body gap="5">
        <Text>Do you want to disconnect your profile from this browser?</Text>
        <Flex direction="column" align="center" gap="2">
          <Avatar size={64} />
          <Heading weight="600">{account.username}</Heading>
          <Text color="gray">Chatkey: {account.chatKey}</Text>
          <EmojiHash />
        </Flex>
      </Dialog.Body>
      <Dialog.Actions>
        <Dialog.Cancel>Stay Connected</Dialog.Cancel>
        <Dialog.Action variant="danger" onClick={deleteAccount}>
          Disconnect
        </Dialog.Action>
      </Dialog.Actions>
    </Dialog>
  )
}
