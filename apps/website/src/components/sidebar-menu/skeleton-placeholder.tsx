import { Skeleton } from '@status-im/components'
import { Stack } from '@tamagui/core'

const SkeletonPlaceholder = () => {
  return (
    <Stack height="100%">
      <Stack
        paddingBottom={16}
        paddingTop={16}
        backgroundColor="$background"
        zIndex={10}
      >
        <Stack paddingBottom={16}>
          <Stack mb={27}>
            <Skeleton height={12} width={120} borderRadius="$6" mb={19} />
            <Stack flexDirection="row" alignItems="center" mb={16}>
              <Skeleton
                height={12}
                width={200}
                borderRadius="$6"
                variant="secondary"
                ml={12}
              />
            </Stack>
            <Stack flexDirection="row" alignItems="center" mb={16}>
              <Skeleton
                height={12}
                width={100}
                borderRadius="$6"
                variant="secondary"
                ml={12}
              />
            </Stack>
            <Stack flexDirection="row" alignItems="center" mb={16}>
              <Skeleton
                height={12}
                width={130}
                borderRadius="$6"
                variant="secondary"
                ml={12}
              />
            </Stack>
            <Stack flexDirection="row" alignItems="center">
              <Skeleton
                height={12}
                width={90}
                borderRadius="$6"
                variant="secondary"
                ml={12}
              />
            </Stack>
          </Stack>
          <Stack>
            <Skeleton height={12} width={50} borderRadius={5} mb={19} />
            <Stack flexDirection="row" alignItems="center" mb={16}>
              <Skeleton
                height={12}
                width={120}
                borderRadius="$6"
                variant="secondary"
                ml={12}
              />
            </Stack>
            <Stack flexDirection="row" alignItems="center" mb={16}>
              <Skeleton
                height={12}
                width={100}
                borderRadius="$6"
                variant="secondary"
                ml={12}
              />
            </Stack>
            <Stack flexDirection="row" alignItems="center" mb={16}>
              <Skeleton
                height={12}
                width={200}
                borderRadius="$6"
                variant="secondary"
                ml={12}
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}

export { SkeletonPlaceholder }
