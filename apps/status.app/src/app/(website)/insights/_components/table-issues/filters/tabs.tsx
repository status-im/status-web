import { Skeleton } from '@status-im/components'
import { DoneIcon, OpenIcon } from '@status-im/icons/20'

type Props = {
  count: {
    open?: number
    closed?: number
  }
  activeTab: 'open' | 'closed'
  onTabChange: (tab: 'open' | 'closed') => void
  isLoading?: boolean
}

const Tabs = (props: Props) => {
  const { count, activeTab, onTabChange, isLoading } = props
  const isOpen = activeTab === 'open'

  return (
    <div className="flex">
      <div className="flex items-center pr-4">
        <button
          className={`flex cursor-pointer flex-row items-center transition-colors ${
            isOpen ? 'text-neutral-100' : 'text-neutral-50'
          }`}
          onClick={() => onTabChange('open')}
        >
          {isLoading ? (
            <div className="flex h-[22.5px] w-[75px] flex-row items-center">
              <Skeleton width={20} height={22.5} />
              <Skeleton width={56} height={22.5} />
            </div>
          ) : (
            <div className="flex flex-row items-center">
              <OpenIcon
                className={isOpen ? 'text-neutral-100' : 'text-neutral-50'}
              />
              <span className="pl-1 text-15 font-medium">
                {count.open} Open
              </span>
            </div>
          )}
        </button>
      </div>
      <div className="flex items-center pr-3">
        <button
          className={`flex cursor-pointer flex-row items-center transition-colors ${
            !isOpen ? 'text-neutral-100' : 'text-neutral-50'
          }`}
          onClick={() => onTabChange('closed')}
        >
          {isLoading ? (
            <div className="flex w-[75px] flex-row items-center">
              <Skeleton width={20} height={20} />
              <Skeleton width={56} height={20} />
            </div>
          ) : (
            <div className="flex flex-row items-center">
              <DoneIcon
                className={!isOpen ? 'text-neutral-100' : 'text-neutral-50'}
              />
              <span className="pl-1 text-15 font-medium">
                {count.closed} Closed
              </span>
            </div>
          )}
        </button>
      </div>
    </div>
  )
}

export { Tabs }
