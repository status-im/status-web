import { ExternalIcon } from '@status-im/icons/16'
import { cx } from 'class-variance-authority'

type InfoCardProps = {
  label: string
  value: React.ReactNode
  url?: string
  fontStyle?: 'default' | 'mono'
}
export function InfoCard(props: InfoCardProps) {
  const { label, value, url, fontStyle = 'default' } = props

  const content = (
    <>
      <div className="truncate text-13 font-medium text-neutral-50">
        {label}
      </div>
      <div
        className={cx(
          'truncate text-13 font-semibold text-neutral-100',
          fontStyle === 'mono' && 'font-mono'
        )}
      >
        {value}
      </div>
    </>
  )

  const className =
    'block rounded-12 border border-neutral-10 bg-neutral-2.5 px-3 py-2 relative group'

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        <div className="absolute right-2 top-2 text-11 text-neutral-40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
          <ExternalIcon />
        </div>
        {content}
      </a>
    )
  }

  return <div className={className}>{content}</div>
}
