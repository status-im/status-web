import { ReceiveIcon, SendIcon } from '@status-im/icons/20'

type ActivityDirectionProps = {
  direction: 'sent' | 'received'
}

const ActivityDirection = (props: ActivityDirectionProps) => {
  const { direction } = props
  const Icon = direction === 'sent' ? SendIcon : ReceiveIcon
  const text = direction === 'sent' ? 'Sent' : 'Received'

  return (
    <div className="flex items-center gap-1 text-15 font-600 text-neutral-100">
      <Icon className="text-neutral-50" />
      {text}
    </div>
  )
}

export { ActivityDirection }
