import React from 'react'

import {
  Avatar,
  Dialog,
  // EmojiHash,
  EthAddress,
  Flex,
  Heading,
  Text,
} from '../../../../system'

import type { Account } from '../../../../protocol'

interface Props {
  account: Account
}

export const ThrowawayProfileFoundDialog = (props: Props) => {
  const { account } = props

  const handleLoad = () => {
    // TODO: load throwaway profile
  }

  return (
    <Dialog title="Throwaway Profile Found">
      <Dialog.Body gap="5">
        <Flex direction="column" align="center" gap="2">
          <Avatar size={64} name={account.username} />
          <Heading weight="600">{account.username}</Heading>

          <EthAddress color="gray">{account.chatKey}</EthAddress>
          {/* <Text color="gray">Chatkey: {account.chatKey}</Text> */}
          {/* <EmojiHash /> */}
        </Flex>
        <Text>
          Throwaway profile is found in your local storage.
          <br />
          Would you like to use it?
        </Text>
      </Dialog.Body>

      <Dialog.Actions>
        <Dialog.Cancel variant="outline">Skip</Dialog.Cancel>
        <Dialog.Action onClick={handleLoad}>
          Load Throwaway Profile
        </Dialog.Action>
      </Dialog.Actions>
    </Dialog>
  )
}
