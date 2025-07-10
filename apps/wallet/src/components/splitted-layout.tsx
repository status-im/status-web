import { Suspense } from 'react'

import { Avatar, Skeleton } from '@status-im/components'
import { Balance, StickyHeaderContainer } from '@status-im/wallet/components'

import { useWallet } from '@/providers/wallet-context'

import { ActionButtons } from '../components/action-buttons'
import { RecoveryPhraseBackup } from '../components/recovery-phrase-backup'
import { DevSuspenseWrapper } from './dev-suspense-wrapper'
import { TabLink } from './tab-link'

type Props = {
  list: React.ReactNode
  detail?: React.ReactNode
  isLoading?: boolean
  loadingState?: React.ReactNode
}

const DEFAULT_SUMMARY = {
  total_balance: 0,
  total_eur: 0,
  total_eur_24h_change: 0.0,
  total_percentage_24h_change: 0.0,
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
  const { list, detail, isLoading, loadingState } = props

  const { currentWallet, isLoading: isWalletLoading } = useWallet()

  const address = currentWallet?.activeAccounts[0].address

  const { data } = useAssets({
    address,
    isWalletLoading,
  })

  const summary = data?.summary ? data.summary : DEFAULT_SUMMARY

  return (
    <div className="grid flex-1 divide-x divide-neutral-10 overflow-hidden">
      {/* Main content */}
      <div className="flex divide-x divide-default-neutral-20">
        <div className="flex grow flex-col 2xl:basis-1/2">
          <div className="relative h-[calc(100vh-56px)] overflow-auto">
            <StickyHeaderContainer
              isLarge
              className="px-6 xl:px-12"
              leftSlot={
                <Suspense
                  fallback={
                    <div className="flex flex-col gap-2 px-3">
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="hidden items-center gap-1.5 xl:flex">
                          <Skeleton
                            height={27}
                            width={27}
                            className="rounded-10"
                          />
                          <Skeleton
                            height={16}
                            width={73}
                            className="rounded-10"
                          />
                        </div>
                      </div>
                      <div className="-mt-2 flex items-center gap-1">
                        <Skeleton
                          height={27}
                          width={73}
                          className="rounded-10"
                        />
                        <Skeleton
                          height={16}
                          width={16}
                          className="rounded-10"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <Skeleton
                          height={12}
                          width={40}
                          className="rounded-10"
                        />
                        <Skeleton
                          height={12}
                          width={26}
                          className="rounded-10"
                        />
                        <Skeleton
                          height={12}
                          width={34}
                          className="rounded-10"
                        />
                      </div>
                    </div>
                  }
                >
                  <DevSuspenseWrapper>
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
                    <Balance summary={summary} />
                  </DevSuspenseWrapper>
                </Suspense>
              }
              rightSlot={
                <Suspense
                  fallback={
                    <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
                      <Skeleton
                        height={32}
                        width={70}
                        className="rounded-10"
                        variant="secondary"
                      />
                      <Skeleton
                        height={32}
                        width={105}
                        className="rounded-10"
                        variant="secondary"
                      />
                    </div>
                  }
                >
                  <DevSuspenseWrapper>
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
                    </div>
                  </DevSuspenseWrapper>
                </Suspense>
              }
            >
              <div className="relative -mt-8 flex flex-1 flex-col px-3 xl:mt-0 xl:px-12">
                {/* Todo?: decide if it makes sense to abstract this component with the account call inside keeping the current suspense model or change it to a regular loading state here instead */}
                <Suspense
                  fallback={
                    <div className="flex flex-col gap-2 px-3">
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="hidden items-center gap-1.5 xl:flex">
                          <Skeleton
                            height={27}
                            width={27}
                            className="rounded-10"
                            variant="secondary"
                          />
                          <Skeleton
                            height={16}
                            width={73}
                            className="rounded-10"
                            variant="secondary"
                          />
                        </div>
                        <Skeleton
                          height={27}
                          width={186}
                          className="rounded-10"
                          variant="secondary"
                        />
                      </div>
                      <div className="mt-1 flex items-center gap-1">
                        <Skeleton
                          height={27}
                          width={73}
                          className="rounded-10"
                          variant="secondary"
                        />
                        <Skeleton
                          height={16}
                          width={16}
                          className="rounded-10"
                          variant="secondary"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <Skeleton
                          height={12}
                          width={40}
                          className="rounded-10"
                          variant="secondary"
                        />
                        <Skeleton
                          height={12}
                          width={26}
                          className="rounded-10"
                          variant="secondary"
                        />
                        <Skeleton
                          height={12}
                          width={34}
                          className="rounded-10"
                          variant="secondary"
                        />
                      </div>
                      <div className="my-5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Skeleton
                            height={32}
                            width={70}
                            className="rounded-10"
                            variant="secondary"
                          />
                          <Skeleton
                            height={32}
                            width={105}
                            className="rounded-10"
                            variant="secondary"
                          />
                        </div>
                        <Skeleton
                          height={32}
                          width={32}
                          className="rounded-10"
                          variant="secondary"
                        />
                      </div>
                    </div>
                  }
                >
                  <DevSuspenseWrapper>
                    <div className="mb-5 flex flex-col gap-2 px-3">
                      <div
                        className="flex items-center justify-between gap-1.5"
                        data-customisation={account.color}
                      >
                        <div className="hidden items-center gap-1.5 xl:flex">
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
                        <div data-customisation="blue">
                          <RecoveryPhraseBackup />
                        </div>
                      </div>

                      <div className="mb-4">
                        <Balance summary={summary} />
                      </div>

                      <ActionButtons {...actionsButtonsData} />
                    </div>
                  </DevSuspenseWrapper>
                </Suspense>

                {isLoading ? loadingState : list}
              </div>
            </StickyHeaderContainer>
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
