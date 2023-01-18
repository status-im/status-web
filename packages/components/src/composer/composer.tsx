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

const Composer = () => {
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
            noBackground
            icon={<ImageIcon />}
            selected={showMembers}
            onPress={() => setShowMembers(!showMembers)}
          />
          <IconButton noBackground icon={<ReactionIcon />} />
          <IconButton noBackground icon={<FormatIcon />} />
        </Stack>
        <IconButton noBackground icon={<AudioIcon />} />
      </XStack>
    </YStack>
  )
}

export { Composer }
