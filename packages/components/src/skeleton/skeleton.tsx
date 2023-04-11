import { Stack, useTheme } from '@tamagui/core'

import type { RadiusTokens } from '../tokens'
import type { ColorTokens, StackProps } from '@tamagui/core'

type Props = StackProps & {
  width?: number | string
  height?: number | string
  borderRadius?: RadiusTokens
  variant?: 'primary' | 'secondary'
}

const skeletonColor: Record<NonNullable<Props['variant']>, ColorTokens> = {
  primary: '$neutral-10',
  secondary: '$neutral-20',
}

const Skeleton = (props: Props) => {
  const {
    width = 32,
    height = 32,
    borderRadius = '$16',
    variant = 'primary',
    ...rest
  } = props

  const theme = useTheme()
  /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const color = theme[skeletonColor[variant]]?.val

  return (
    <Stack
      height={height}
      maxWidth={width}
      width="100%"
      borderRadius={borderRadius}
      overflow="hidden"
      {...rest}
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
export type { Props as SkeletonProps }
