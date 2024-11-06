import { cva, cx, type VariantProps } from 'cva'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const styles = cva({
  base: 'animate-skeleton overflow-hidden',

  variants: {
    variant: {
      primary: 'bg-neutral-10',
      secondary: 'bg-neutral-20',
    },
    //   radius: {
    //     none: 'rounded-none',
    //     sm: 'rounded',
    //     md: 'rounded-md',
    //     lg: 'rounded-lg',
    //     xl: 'rounded-xl',
    //     '2xl': 'rounded-2xl',
    //     full: 'rounded-full',
    //   },
  },
  defaultVariants: {
    variant: 'primary',
    // radius: '2xl',
  },
})

type SkeletonProps = VariantProps<typeof styles> & {
  width?: number | string
  height?: number | string
  className?: string
}

export function Skeleton(props: SkeletonProps) {
  const {
    width = 32,
    height = 32,
    //   variant,
    //   radius,
    className,
    ...rest
  } = props

  return (
    <div
      className={cx(
        'animate-skeleton overflow-hidden bg-neutral-10',
        className,
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        background: `linear-gradient(-90deg, #F0F2F5, #FCFCFC, #F0F2F5)`,
        backgroundSize: '400% 400%',
      }}
      {...rest}
    />
  )
}

export type { SkeletonProps }
