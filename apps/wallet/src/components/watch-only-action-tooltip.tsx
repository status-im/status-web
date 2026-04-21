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
      <span className="inline-flex">{children}</span>
    </Tooltip>
  )
}

export { WatchOnlyActionTooltip }
