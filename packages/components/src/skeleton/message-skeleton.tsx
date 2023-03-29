import { Stack } from '@tamagui/core'

import { Skeleton } from './skeleton'

import type { StackProps } from '@tamagui/core'

type SizeVariant = 'smallest' | 'small' | 'medium' | 'large'

type MessageSkeletonProps = Omit<StackProps, 'size'> & {
  size?: SizeVariant
}

const sizeTopPlaceholderValues = {
  smallest: 80,
  small: 96,
  medium: 112,
  large: 124,
}

const sizeBottomPlaceholderValues = {
  smallest: 144,
  small: 156,
  medium: 212,
  large: 249,
}

const MessageSkeleton = ({ size, ...props }: MessageSkeletonProps) => {
  return (
    <Stack flexDirection="row" p={8} width="100%" {...props}>
      {/* Avatar */}
      <Skeleton />
      <Stack flex={1} ml={8}>
        {/* Text placeholders */}
        <Skeleton
          width={sizeTopPlaceholderValues[size || 'medium']}
          br={6}
          height={8}
          mb={8}
        />
        <Skeleton
          width={sizeBottomPlaceholderValues[size || 'medium']}
          br={6}
          height={16}
        />
      </Stack>
    </Stack>
  )
}

export { MessageSkeleton }
