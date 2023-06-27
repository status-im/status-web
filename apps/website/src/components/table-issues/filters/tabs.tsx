import { useState } from 'react'

import { DoneIcon, OpenIcon } from '@status-im/icons'

type Props = {
  count: {
    open: number
    closed: number
  }
}
const Tabs = (props: Props): JSX.Element => {
  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open')

  const isOpen = activeTab === 'open'

  const { count } = props

  return (
    <div className="flex">
      <div className="flex items-center pr-4">
        <button
          className={`flex cursor-pointer flex-row items-center transition-colors ${
            isOpen ? 'text-neutral-100' : 'text-neutral-50'
          }`}
          onClick={() => setActiveTab('open')}
        >
          <OpenIcon size={20} color={isOpen ? '$neutral-100' : '$neutral-50'} />
          <span className="pl-1 text-[15px]">{count.open} Open</span>
        </button>
      </div>
      <div className="flex items-center pr-3">
        <button
          className={`flex cursor-pointer flex-row items-center transition-colors ${
            !isOpen ? 'text-neutral-100' : 'text-neutral-50'
          }`}
          onClick={() => setActiveTab('closed')}
        >
          <DoneIcon
            size={20}
            color={!isOpen ? '$neutral-100' : '$neutral-50'}
          />
          <span className="pl-1 text-[15px]">{count.closed} Closed</span>
        </button>
      </div>
    </div>
  )
}

export { Tabs }
