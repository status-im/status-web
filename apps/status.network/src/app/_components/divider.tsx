import { cva } from 'cva'

type Props = {
  variant?: 'fullscreen' | 'default' | 'left'
  hasMiddleCircle?: boolean
}

const dividerStyles = cva({
  base: 'relative bottom-0 h-px bg-neutral-20 z-20',
  variants: {
    variant: {
      fullscreen:
        'left-1/2 w-[calc(100%+16px)] lg:w-[calc(100%+16px)] 2xl:w-[calc(100%+96px)] -translate-x-1/2',
      default: 'relative right-[-3px] size-[5px] rounded-full w-full',
      left: 'absolute -left-2 lg:left-0 w-[calc(100%+8px)] 2xl:w-[calc(100%+48px)]',
    },
  },
})

const Divider = (props: Props) => {
  const { variant = 'fullscreen', hasMiddleCircle } = props

  return (
    <div className="relative">
      <div className="absolute left-[-3px] top-[-2px] size-[5px] rounded-full bg-neutral-20" />
      <div
        className={dividerStyles({
          variant,
        })}
      />
      {hasMiddleCircle && (
        <div className="absolute bottom-[-2px] left-1/2 size-[5px] -translate-x-1/2 rounded-full bg-neutral-20" />
      )}
      <div className="absolute bottom-[-2px] right-[-3px] size-[5px] rounded-full bg-neutral-20" />
    </div>
  )
}

export { Divider }
