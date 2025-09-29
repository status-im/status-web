import { cx } from 'class-variance-authority'

export const Body = (props: React.ComponentPropsWithoutRef<'div'>) => {
  const { children, className, ...rest } = props

  return (
    <div
      {...rest}
      className={cx(
        'relative isolate z-10 min-h-[calc(100vh-60px)] w-full overflow-clip rounded-[24px] bg-white-100',
        className
      )}
    >
      {children}
    </div>
  )
}
