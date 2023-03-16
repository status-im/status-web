import { Fragment, useState } from 'react'

import { PinIcon } from '@status-im/icons/20'
import { Pressable, View } from 'react-native'

import { Banner } from '../banner'
import { Dialog } from '../dialog'

import type { MessageProps } from '../messages'

type PinnedMessageProps = {
  messages: MessageProps[]
}

export const PinnedMessage = ({ messages }: PinnedMessageProps) => {
  const [isDetailVisible, setIsDetailVisible] = useState(false)
  return messages.length > 0 ? (
    <>
      <Dialog open={isDetailVisible}>
        <Pressable onPress={() => setIsDetailVisible(true)}>
          <Banner count={messages.length} icon={<PinIcon />}>
            {messages[0].text}
          </Banner>
        </Pressable>

        <View>
          {messages.map((message, i) => (
            // anti-pattern
            <Fragment key={i}>
              <View>{message.text}</View>
            </Fragment>
          ))}
        </View>
      </Dialog>
    </>
  ) : null
}
