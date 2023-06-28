import { ActiveMembersIcon, OpenIcon } from '@status-im/icons'

type Props = {
  count: {
    open?: number
    closed?: number
  }
  activeTab: 'open' | 'closed'
  handleTabChange: (tab: 'open' | 'closed') => void
}
const Tabs = (props: Props): JSX.Element => {
  const { count, activeTab, handleTabChange } = props
  const isOpen = activeTab === 'open'

  return (
    <div className="flex">
      <div className="flex items-center pr-4">
        <button
          className={`flex cursor-pointer flex-row items-center transition-colors ${
            isOpen ? 'text-neutral-100' : 'text-neutral-50'
          }`}
          onClick={() => handleTabChange('open')}
        >
          <OpenIcon size={20} color={isOpen ? '$neutral-100' : '$neutral-50'} />
          <span className="pl-1 text-[15px]">
            {typeof count.open === 'number' ? count.open : '-'} Open
          </span>
        </button>
      </div>
      <div className="flex items-center pr-3">
        <button
          className={`flex cursor-pointer flex-row items-center transition-colors ${
            !isOpen ? 'text-neutral-100' : 'text-neutral-50'
          }`}
          onClick={() => handleTabChange('closed')}
        >
          <ActiveMembersIcon
            size={20}
            color={!isOpen ? '$neutral-100' : '$neutral-50'}
          />
          <span className="pl-1 text-[15px]">
            {typeof count.closed === 'number' ? count.closed : '-'} Closed
          </span>
        </button>
      </div>
    </div>
  )
}

export { Tabs }
