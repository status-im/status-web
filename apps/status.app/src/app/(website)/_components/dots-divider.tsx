import { cx } from 'class-variance-authority'

type Props = {
  dark?: boolean
  className?: string
}

export const DotsDivider = (props: Props) => {
  const { dark = false, className } = props

  return (
    <div
      className={cx('flex w-full justify-center gap-3', className)}
      role="separator"
    >
      {[1, 2, 3].map(i => (
        <span
          key={i}
          className={cx(
            'aspect-square w-1 rounded-full md:w-2',
            dark ? 'bg-neutral-40' : 'bg-neutral-30'
          )}
        />
      ))}
    </div>
  )
}
