import { Stack } from '@tamagui/core'

import { Skeleton } from './skeleton'

import type { StackProps } from '@tamagui/core'

type Props = StackProps & {
  numberOfBars?: number
}

const WaveformSkeleton = (props: Props) => {
  const { numberOfBars = 20, ...rest } = props

  return (
    <Stack
      flexGrow={1}
      width="100%"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Skeleton variant="secondary" />
      <Stack
        flexDirection="row"
        width="100%"
        alignItems="center"
        flexGrow={1}
        justifyContent="center"
        {...rest}
      >
        {[...Array(numberOfBars)].map((_, index) => (
          <Skeleton
            key={index}
            height={5}
            width={2}
            mr={4}
            variant="tertiary"
          />
        ))}
      </Stack>
      <Skeleton variant="secondary" width={31} height={12} />
    </Stack>
  )
}

export { WaveformSkeleton }
