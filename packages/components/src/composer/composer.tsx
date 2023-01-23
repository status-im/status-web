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
  return (
    <YStack
      backgroundColor="$background"
      shadowColor="rgba(9, 16, 28, 0.08)"
      shadowOffset={{ width: 0, height: -4 }}
      shadowRadius={20}
      borderTopLeftRadius={20}
      borderTopRightRadius={20}
      px={16}
      pt={8}
      width="100%"
      style={{
        elevation: 10,
      }}
      {...props}
    >
      <Input placeholder="Type something..." borderWidth={0} px={0} />
      <XStack alignItems="center" justifyContent="space-between" pt={8}>
        <Stack space={12} flexDirection="row">
          <IconButton noBackground icon={<ImageIcon />} />
          <IconButton noBackground icon={<ReactionIcon />} />
          <IconButton noBackground icon={<FormatIcon />} />
        </Stack>
        <IconButton noBackground icon={<AudioIcon />} />
      </XStack>
    </YStack>
  )
}

export { Composer }
