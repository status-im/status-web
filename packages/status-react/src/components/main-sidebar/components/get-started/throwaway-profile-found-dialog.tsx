import React from 'react'

import { useAccount } from '~/src/protocol'
import { Avatar, Dialog, EmojiHash, Flex, Heading, Text } from '~/src/system'

interface Props {
  onSkip: () => void
}

export const ThrowawayProfileFoundDialog = (props: Props) => {
  const { onSkip } = props

  const { account } = useAccount()

  const handleLoadThrowawayProfile = () => {
    // TODO: load throwaway profile
  }

  if (!account) {
    return null
  }

  return (
    <Dialog title="Throwaway Profile Found">
      <Dialog.Body gap="5">
        <Flex direction="column" align="center" gap="2">
          <Avatar size={64} />
          <Heading weight="600">{account.username}</Heading>
          <Text color="gray">
            Chatkey: 0x63FaC9201494f0bd17B9892B9fae4d52fe3BD377
          </Text>
          <EmojiHash />
        </Flex>
        <Text>
          Throwaway profile is found in your local {"browser's"} storage.
          <br />
          Would you like to load it and use it?
        </Text>
      </Dialog.Body>

      <Dialog.Actions>
        <Dialog.Action variant="outline" onClick={onSkip}>
          Skip
        </Dialog.Action>
        <Dialog.Action onClick={handleLoadThrowawayProfile}>
          Load Throwaway Profile
        </Dialog.Action>
      </Dialog.Actions>
    </Dialog>
  )
}
