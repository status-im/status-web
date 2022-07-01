import React from 'react'

import {
  Avatar,
  Dialog,
  // EmojiHash,
  Flex,
  Heading,
  Text,
  TextInput,
} from '../../system'

export const CreateProfileDialog = () => {
  return (
    <Dialog title="Create Status Profile">
      {/* <Dialog.Body align="stretch" css={{ paddingTop: 32 }}>
        <Heading
          size="22"
          weight="600"
          align="center"
          css={{ marginBottom: 16 }}
        >
          Your emojihash and identicon ring
        </Heading>
        <Text color="gray" align="center" size="15" css={{ marginBottom: 32 }}>
          This set of emojis and coloured ring around your avatar are unique and
          represent your chat key, so your friends can easily distinguish you
          from potential impersonators.
        </Text>
        <Flex justify="center" css={{ marginBottom: 38 }}>
          <Avatar size="80" />
        </Flex>
        <Text color="gray" align="center">
          Chatkey: 0x63FaC920149...fae4d52fe3BD377
        </Text>
        <EmojiHash />
      </Dialog.Body> */}

      <Dialog.Body align="stretch" css={{ paddingTop: 32 }}>
        <Heading
          size="22"
          weight="600"
          align="center"
          css={{ marginBottom: 16 }}
        >
          Your profile
        </Heading>
        <Text color="gray" align="center" css={{ marginBottom: 32 }}>
          Longer and unusual names are better as they
          <br />
          are less likely to be used by someone else.
        </Text>
        <Flex justify="center" css={{ marginBottom: 38 }}>
          <Avatar size="80" />
        </Flex>
        <TextInput placeholder="Display name" />
      </Dialog.Body>
      <Dialog.Actions>
        <Dialog.Action>Next</Dialog.Action>
      </Dialog.Actions>
    </Dialog>
  )
}
