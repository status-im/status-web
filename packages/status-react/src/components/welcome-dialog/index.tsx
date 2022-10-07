import React, { useState } from 'react'

import { useProtocol } from '../../protocol'
import { Avatar, Checkbox, Dialog, Flex, Text } from '../../system'

export const WelcomeDialog = () => {
  const { community } = useProtocol()
  const { identity } = community

  const [agreed, setAgreed] = useState(false)

  return (
    <Dialog title={`Welcome to ${identity?.displayName}`} size={640}>
      <Dialog.Body gap="4">
        <Flex justify="center">
          <Avatar
            size="64"
            src={identity?.displayName}
            color={identity?.color}
            initialsLength={1}
          />
        </Flex>
        <Text>{identity?.description}</Text>
        <Flex>
          <Checkbox checked={agreed} onChange={setAgreed}>
            I agree with the above
          </Checkbox>
        </Flex>
      </Dialog.Body>
      <Dialog.Actions>
        <Dialog.Action disabled={agreed === false}>
          Request to Join
          {/* {requestNeeded ? 'Request to Join' : `Join ${name}`} */}
        </Dialog.Action>
      </Dialog.Actions>
    </Dialog>
  )
}
