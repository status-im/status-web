import { useState } from 'react'

import {
  AudioIcon,
  FormatIcon,
  ImageIcon,
  ReactionIcon,
} from '@status-im/icons/20'
import { BlurView } from 'expo-blur'
import { Stack, XStack, YStack } from 'tamagui'

import { IconButton } from '../icon-button'
import { Input } from '../input'
import { Reply } from '../reply'

interface Props {
  isBlurred: boolean
  reply: boolean
}

const Composer = (props: Props) => {
  const { isBlurred, reply } = props

  const [isFocused, setIsFocused] = useState(false)

  const iconButtonBlurred = isBlurred && !isFocused

  return (
    <BlurView
      intensity={40}
      style={{
        zIndex: 100,
        borderRadius: 20,
      }}
    >
      <YStack
        animation="fast"
        backgroundColor={isFocused ? '$background' : '$blurBackground'}
        shadowColor={!isBlurred || isFocused ? 'rgba(9, 16, 28, 0.08)' : 'none'}
        shadowOffset={{ width: 4, height: !isBlurred || isFocused ? 4 : 0 }}
        shadowRadius={20}
        borderTopLeftRadius={20}
        borderTopRightRadius={20}
        px={16}
        py={12}
        style={{
          elevation: 10,
        }}
      >
        {reply && (
          <Stack paddingLeft={4} paddingBottom={4}>
            <Reply
              type="text"
              name="Alisher"
              src="https://images.unsplash.com/photo-1524638431109-93d95c968f03?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8Z2lybHx8fHx8fDE2NzM4ODQ0NzU&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500"
              onClose={() => {
                console.log('close')
              }}
            />
          </Stack>
        )}

        <Input
          className="composer-input"
          placeholder="Type something..."
          px={0}
          borderWidth={0}
          blurred={isBlurred}
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
        />

        <XStack
          alignItems="center"
          justifyContent="space-between"
          paddingTop={12}
          backgroundColor="transparent"
        >
          <Stack space={12} flexDirection="row" backgroundColor="transparent">
            <IconButton
              variant="outline"
              icon={<ImageIcon />}
              blurred={iconButtonBlurred}
            />
            <IconButton
              variant="outline"
              icon={<ReactionIcon />}
              blurred={iconButtonBlurred}
            />
            <IconButton
              variant="outline"
              icon={<FormatIcon />}
              disabled
              blurred={iconButtonBlurred}
            />
          </Stack>
          <IconButton
            variant="outline"
            icon={<AudioIcon />}
            blurred={iconButtonBlurred}
          />
        </XStack>
      </YStack>
    </BlurView>
  )
}

export { Composer }
