import { Tooltip } from '@status-im/components'

type Props = {
  children: React.ReactElement
  content: React.ReactNode
  disabled: boolean
}

const WatchOnlyActionTooltip = ({ children, content, disabled }: Props) => {
  if (!disabled) {
    return children
  }

  return (
    <Tooltip content={content} side="top">
      <span
        role="button"
        tabIndex={0}
        aria-disabled="true"
        aria-label={typeof content === 'string' ? content : undefined}
        className="inline-flex"
      >
        {children}
      </span>
    </Tooltip>
  )
}

export { WatchOnlyActionTooltip }
