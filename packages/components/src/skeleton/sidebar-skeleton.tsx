import { Stack } from '@tamagui/core'

import { Skeleton } from './skeleton'

const SidebarSkeleton = () => {
  // Eventually we can in the future abstract some of these components to be reusable if we need to
  return (
    <Stack
      backgroundColor="$background"
      borderRightWidth={1}
      borderColor="$neutral-10"
      height="100%"
      overflow="scroll"
    >
      <Stack height={135} width="100%" backgroundColor="$neutral-10" />
      <Stack
        paddingBottom={16}
        marginTop={-16}
        backgroundColor="$background"
        borderTopLeftRadius={20}
        borderTopRightRadius={20}
        zIndex={10}
      >
        <Stack paddingHorizontal={16} paddingBottom={16}>
          <Stack marginTop={-40} marginBottom={12}>
            <Skeleton
              height={80}
              width={80}
              borderRadius="$full"
              borderWidth={2}
              borderColor="$white-100"
              variant="secondary"
            />
          </Stack>
          <Skeleton
            height={24}
            width={104}
            borderRadius="$8"
            mb={14}
            variant="secondary"
          />
          <Skeleton
            height={16}
            width={312}
            borderRadius="$8"
            mb={8}
            variant="secondary"
          />
          <Skeleton
            height={16}
            width={272}
            borderRadius="$8"
            mb={12}
            variant="secondary"
          />
          <Stack flexDirection="row" alignItems="center" mb={18}>
            <Skeleton height={14} width={14} mr={4} />
            <Skeleton
              height={12}
              width={50}
              borderRadius="$6"
              variant="secondary"
            />
            <Skeleton height={14} width={14} ml={12} mr={4} />
            <Skeleton
              height={12}
              width={50}
              borderRadius="$6"
              variant="secondary"
            />
          </Stack>
          <Stack flexDirection="row" alignItems="center" mb={27} gap={8}>
            <Skeleton height={24} width={76} borderRadius="$20" />
            <Skeleton height={24} width={76} borderRadius="$20" />
            <Skeleton height={24} width={76} borderRadius="$20" />
          </Stack>
          <Stack mb={27}>
            <Skeleton height={12} width={50} borderRadius="$6" mb={19} />
            <Stack flexDirection="row" alignItems="center" mb={16}>
              <Skeleton height={24} width={24} mr={8} />
              <Skeleton
                height={12}
                width={80}
                borderRadius="$6"
                variant="secondary"
              />
            </Stack>
            <Stack flexDirection="row" alignItems="center" mb={16}>
              <Skeleton height={24} width={24} mr={8} />
              <Skeleton
                height={12}
                width={100}
                borderRadius="$6"
                variant="secondary"
              />
            </Stack>
            <Stack flexDirection="row" alignItems="center" mb={16}>
              <Skeleton height={24} width={24} mr={8} />
              <Skeleton
                height={12}
                width={70}
                borderRadius="$6"
                variant="secondary"
              />
            </Stack>
            <Stack flexDirection="row" alignItems="center">
              <Skeleton height={24} width={24} mr={8} />
              <Skeleton
                height={12}
                width={90}
                borderRadius="$6"
                variant="secondary"
              />
            </Stack>
          </Stack>
          <Stack>
            <Skeleton height={12} width={50} borderRadius={5} mb={19} />
            <Stack flexDirection="row" alignItems="center" mb={16}>
              <Skeleton height={24} width={24} mr={8} />
              <Skeleton
                height={12}
                width={80}
                borderRadius="$6"
                variant="secondary"
              />
            </Stack>
            <Stack flexDirection="row" alignItems="center" mb={16}>
              <Skeleton height={24} width={24} mr={8} />
              <Skeleton
                height={12}
                width={100}
                borderRadius="$6"
                variant="secondary"
              />
            </Stack>
            <Stack flexDirection="row" alignItems="center" mb={16}>
              <Skeleton height={24} width={24} mr={8} />
              <Skeleton
                height={12}
                width={70}
                borderRadius="$6"
                variant="secondary"
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}

export { SidebarSkeleton }
