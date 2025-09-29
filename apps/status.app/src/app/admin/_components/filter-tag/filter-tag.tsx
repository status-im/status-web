import { CloseIcon } from '@status-im/icons/12'
import { cx } from 'class-variance-authority'

type GroupProps = {
  children: React.ReactNode
}

export const Group = (props: GroupProps) => {
  const { children } = props

  return <div className="flex flex-wrap gap-2 pb-2 pt-1">{children}</div>
}

type TagProps = {
  title: string
  label: string
  onRemove: () => void
  disabled?: boolean
}

export const Item = (props: TagProps) => {
  const { title, label, onRemove, disabled } = props

  return (
    <div
      className={cx([
        'group flex h-6 select-none items-center justify-between overflow-hidden rounded-20',
        'border border-neutral-20 bg-white-100 transition-all hover:border-neutral-30',
        disabled && 'opacity-[30%]',
      ])}
    >
      <p className="whitespace-nowrap px-2 text-13 font-medium">
        <span className="text-neutral-50">{title}: </span>
        {label}
      </p>
      <button
        disabled={disabled}
        onClick={onRemove}
        className={cx([
          'flex size-6 items-center justify-center pr-0.5 text-neutral-100',
          'border-y border-l border-neutral-20 transition-colors group-hover:border-neutral-30 group-hover:bg-neutral-10',
          disabled && 'cursor-not-allowed',
        ])}
      >
        <CloseIcon />
      </button>
    </div>
  )
}
