import { Avatar } from '@status-im/components'
import { Balance, StickyHeaderContainer } from '@status-im/wallet/components'

import { RecoveryPhraseBackup } from '../components/recovery-phrase-backup'

type Props = {
  list: React.ReactNode
  detail?: React.ReactNode
  isLoading?: boolean
}

// Mock data. todo? Replace with actual data
const SUMMARY = {
  hidden: {
    total_balance: 0,
    total_eur: 0,
    total_eur_24h_change: 0.0,
    total_percentage_24h_change: 0.0,
  },
  visible: {
    total_balance: 203.0,
    total_eur: 203.0,
    total_eur_24h_change: 10.0,
    total_percentage_24h_change: 2.4,
  },
}

//   Includes mock data for actions buttons and options. todo? Replace with actual data
const actionsButtonsData = {
  address: 'portfolio', // This should be the address of the account coming from the URL. Wrote to have active state
  pathname: '/portfolio/assets',
  searchAndSortValues: {
    inputValue: '',
    updateSearchParam: () => {},
    orderByColumn: 'name',
    ascending: true,
    onOrderByChange: () => {},
    sortOptions: {
      name: 'Name',
      balance: 'Balance',
      '24h': '24H%',
      value: 'Value',
      price: 'Price',
    },
  },
}

const account = {
  name: 'Account 1',
  emoji: '🍑',
  color: 'magenta',
}

const SplittedLayout = (props: Props) => {
  const { list, detail, isLoading } = props

  const [showHiddenSummary, setShowHiddenSummary] = useState(false)

  const handleShowHiddenSummary = () => {
    setShowHiddenSummary(!showHiddenSummary)
  }

  return (
    <div className="grid flex-1 divide-x divide-neutral-10 overflow-hidden">
      {/* Main content */}
      <div className="flex divide-x divide-default-neutral-20">
        <div className="flex grow flex-col 2xl:basis-1/2">
          <div className="relative h-[calc(100vh-56px)] overflow-auto">
            {isLoading ? (
              <div className="flex min-h-full items-center justify-center">
                <div className="size-5 animate-spin rounded-full border-b-2 border-neutral-50"></div>
              </div>
            ) : (
              <StickyHeaderContainer
                isLarge
                className="px-6 xl:px-12"
                leftSlot={
                  <>
                    <div
                      className="hidden items-center gap-1.5 xl:flex"
                      data-customisation={account.color}
                    >
                      <Avatar
                        type="account"
                        name={account.name}
                        emoji={account.emoji}
                        size="24"
                        bgOpacity="20"
                      />
                      <div className="text-15 font-semibold text-neutral-100">
                        {account.name}
                      </div>
                    </div>
                    <Balance
                      summary={
                        showHiddenSummary ? SUMMARY.visible : SUMMARY.hidden
                      }
                      onShowHiddenSummary={handleShowHiddenSummary}
                    />
                  </>
                }
                rightSlot={
                  <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
                    <TabLink
                      href="/portfolio/assets"
                      className="w-full justify-center text-center sm:w-fit"
                    >
                      Assets
                    </TabLink>
                    <TabLink href="/portfolio/collectibles">
                      Collectibles
                    </TabLink>
                    <TabLink href="/portfolio/activity">Activity</TabLink>
                  </div>
                }
              >
                <div className="relative -mt-8 flex flex-1 flex-col px-3 xl:mt-0 xl:px-12">
                  <div className="mb-5 flex flex-col gap-2 px-3">
                    <div
                      className="hidden items-center gap-1.5 xl:flex"
                      data-customisation={account.color}
                    >
                      <Avatar
                        type="account"
                        name={account.name}
                        emoji={account.emoji}
                        size="24"
                        bgOpacity="20"
                      />
                      <div className="text-15 font-semibold text-neutral-100">
                        {account.name}
                      </div>
                    </div>

                    <div className="mb-4">
                      <Balance
                        summary={
                          showHiddenSummary ? SUMMARY.visible : SUMMARY.hidden
                        }
                        onShowHiddenSummary={handleShowHiddenSummary}
                      />
                    </div>

                    <ActionButtons {...actionsButtonsData} />

                    <div className="my-4 flex">
                      <RecoveryPhraseBackup />
                    </div>
                  </div>

                  {list}
                </div>
              </StickyHeaderContainer>
            )}
          </div>
        </div>

        <div className="relative hidden basis-1/2 flex-col bg-white-100 2xl:flex">
          <div className="relative z-20 size-full">{detail}</div>

          <div
            className="absolute z-10 size-full"
            style={{
              backgroundColor: 'rgba(245, 246, 248, 0.24)',
            }}
          />
          <div className="absolute z-0 size-full bg-gradient-to-r from-[#F5F6F83D] to-transparent" />
        </div>
      </div>
    </div>
  )
}

export default SplittedLayout
