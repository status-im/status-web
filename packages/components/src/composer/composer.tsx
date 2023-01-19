import { useState } from 'react'

import {
  AudioIcon,
  FormatIcon,
  ImageIcon,
  ReactionIcon,
} from '@status-im/icons'
import { Stack, XStack, YStack } from 'tamagui'

import { IconButton } from '../icon-button'
import { Input } from '../input'

import type { GetProps } from '@tamagui/core'

type BaseProps = GetProps<typeof YStack>

const Composer = (props: BaseProps) => {
  const [showMembers, setShowMembers] = useState(false)
  return (
    <YStack
      backgroundColor="$background"
      shadowColor="rgba(9, 16, 28, 0.08)"
      shadowOffset={{ width: 0, height: -4 }}
      shadowRadius={20}
      borderTopLeftRadius={20}
      borderTopRightRadius={20}
      elevation={0}
      px={16}
      pt={8}
      pb={12}
      width="100%"
      {...props}
    >
      <YStack>
        <Input
          elevation={10}
          placeholder="Type something..."
          borderWidth={0}
          px={0}
        />
      </YStack>
      <XStack alignItems="center" justifyContent="space-between" pt={8}>
        <Stack space={12} flexDirection="row">
          <IconButton
            icon={<ImageIcon />}
            selected={showMembers}
            onPress={() => setShowMembers(!showMembers)}
          />
          <IconButton icon={<ReactionIcon />} />
          <IconButton icon={<FormatIcon />} />
        </Stack>
        <IconButton icon={<AudioIcon />} />
      </XStack>
    </YStack>
  )
}

export { Composer }
