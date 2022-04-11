import React, { useState } from 'react'

import { useCommunity } from '~/src/protocol/use-community'
import { Avatar, Dialog, Flex, Text } from '~/src/system'
import { Checkbox } from '~/src/system/checkbox'

export const WelcomeDialog = () => {
  const { name } = useCommunity()

  const [agreed, setAgreed] = useState(false)

  return (
    <Dialog title={`Welcome to ${name}`} size={640}>
      <Dialog.Body>
        <Flex justify="center" css={{ marginBottom: 24 }}>
          <Avatar size="64" />
        </Flex>
        <Text>
          CryptoKitties sed ut perspiciatis unde omnis iste natus error sit
          voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque
          ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae
          dicta sunt explicabo.
          <br />
          <br />
          Ut enim ad minim veniam Excepteur sint occaecat cupidatat non proident
          Duis aute irure Dolore eu fugiat nulla pariatur 🚗 consectetur
          adipiscing elit.
          <br />
          <br />
          Nemo enim 😋 ipsam voluptatem quia voluptas sit aspernatur aut odit
          aut fugit, sed quia consequuntur magni dolores eos qui ratione
          voluptatem sequi nesciunt.
        </Text>

        <Checkbox checked={agreed} onChange={setAgreed}>
          I agree with the above
        </Checkbox>
      </Dialog.Body>
      <Dialog.Actions>
        <Dialog.Action disabled={agreed === false}>
          Request to Join
        </Dialog.Action>
      </Dialog.Actions>
    </Dialog>
  )
}
