import { Stack } from '@tamagui/core'

import type { StackProps } from '@tamagui/core'

type SkeletonProps = StackProps & {
  width?: number
  height?: number
  borderRadius?: number
}
const Skeleton = ({
  width = 32,
  height = 32,
  borderRadius = 16,
  ...props
}: SkeletonProps) => {
  return (
    <Stack
      height={height}
      maxWidth={width}
      width="100%"
      borderRadius={borderRadius}
      overflow="hidden"
      {...props}
    >
      <div
        style={{
          maxWidth: width,
          width: '100%',
          height,
          borderRadius,
          background: 'linear-gradient(-90deg, #F5F6F8, #FCFCFC, #F5F6F8)',
          backgroundSize: '400% 400%',
          animation: 'gradient 1.5s ease infinite',
        }}
      />
    </Stack>
  )
}

export { Skeleton }
