import { ChevronRightIcon } from '@status-im/icons/12'
import { cx } from 'class-variance-authority'
import Link from 'next/link'

type DataItemProps = {
  label: string
  children: React.ReactNode
  className?: string
  href?: string
  mono?: boolean
}

const DataItem = (props: DataItemProps) => {
  const { children, label, href, className, mono } = props

  return (
    <div
      className={cx([
        'flex w-full flex-col items-start justify-center rounded-16 border border-neutral-10 bg-neutral-2.5 px-3 py-2',
        className,
      ])}
    >
      <span className="text-13 font-medium text-neutral-50">{label}</span>
      {href ? (
        <Link
          href={href}
          className="flex items-center text-13 font-medium transition-colors hover:text-neutral-50"
        >
          {children}
          <span className="ml-0.5">
            <ChevronRightIcon />
          </span>
        </Link>
      ) : (
        <span
          className={cx([
            'flex items-center gap-1 text-13 font-medium',
            mono && 'font-mono',
          ])}
        >
          {children}
        </span>
      )}
    </div>
  )
}

export { DataItem }
