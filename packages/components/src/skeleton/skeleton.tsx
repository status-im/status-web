import { Stack, useTheme } from '@tamagui/core'

import type { ColorTokens, StackProps } from '@tamagui/core'

type SkeletonProps = StackProps & {
  width?: number | string
  height?: number | string
  borderRadius?: number
  variant?: 'primary' | 'secondary'
}

const colorValue: Record<NonNullable<SkeletonProps['variant']>, ColorTokens> = {
  primary: '$neutral-10',
  secondary: '$neutral-20',
}

const Skeleton = ({
  width = 32,
  height = 32,
  borderRadius = 16,
  variant = 'primary',
  ...props
}: SkeletonProps) => {
  const theme = useTheme()
  /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const color = theme[colorValue[variant]]?.val

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
          background: `linear-gradient(-90deg, ${color}, #FCFCFC, ${color})`,
          backgroundSize: '400% 400%',
          animation: 'gradient 1.5s ease infinite',
        }}
      />
    </Stack>
  )
}

export { Skeleton }
