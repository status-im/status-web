import React, { useState } from 'react'

import { useCommunity } from '~/src/protocol/use-community'
import { Avatar, Checkbox, Dialog, Flex, Text } from '~/src/system'

export const WelcomeDialog = () => {
  const { name, imageUrl, requestNeeded } = useCommunity()

  const [agreed, setAgreed] = useState(false)

  return (
    <Dialog title={`Welcome to ${name}`} size={640}>
      <Dialog.Body gap="4">
        <Flex justify="center">
          <Avatar size="64" src={imageUrl} />
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
        <Flex>
          <Checkbox checked={agreed} onChange={setAgreed}>
            I agree with the above
          </Checkbox>
        </Flex>
      </Dialog.Body>
      <Dialog.Actions>
        <Dialog.Action disabled={agreed === false}>
          {requestNeeded ? 'Request to Join' : `Join ${name}`}
        </Dialog.Action>
      </Dialog.Actions>
    </Dialog>
  )
}
