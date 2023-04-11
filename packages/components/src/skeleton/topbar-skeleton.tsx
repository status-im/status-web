import { Stack } from '@tamagui/core'
import { BlurView } from 'expo-blur'

import { Skeleton } from './skeleton'

const TopbarSkeleton = () => {
  return (
    <BlurView intensity={40} style={{ zIndex: 100 }}>
      <Stack flexDirection="column" width="100%" height={96}>
        <Stack
          flexDirection="row"
          height={56}
          alignItems="center"
          justifyContent="space-between"
          py={12}
          px={16}
          backgroundColor={'$blurBackground'}
          borderBottomWidth={1}
          borderColor={'$neutral-80-opa-10'}
          width="100%"
        >
          <Stack
            flexDirection="row"
            alignItems="center"
            flexWrap="wrap"
            flexGrow={1}
            flexShrink={1}
          >
            <Skeleton height={24} width={24} mr={8} />
            <Skeleton
              height={16}
              width={92}
              borderRadius="$6"
              variant="secondary"
            />
          </Stack>
          <Stack
            space={12}
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-end"
            flexGrow={1}
            flexShrink={1}
          >
            <Skeleton height={32} width={32} borderRadius="$10" />
            <Skeleton height={32} width={32} borderRadius="$10" />
          </Stack>
        </Stack>
      </Stack>
    </BlurView>
  )
}

export { TopbarSkeleton }
