import { Avatar, Skeleton } from '@status-im/components'
import { Balance, StickyHeaderContainer } from '@status-im/wallet/components'

import { usePortfolio } from '@/hooks/use-portfolio'
import { useWallet } from '@/providers/wallet-context'

import { ActionButtons } from '../components/action-buttons'
import { RecoveryPhraseBackup } from '../components/recovery-phrase-backup'
import {
  AccountSkeleton,
  ActionButtonsSkeleton,
  BalanceSkeleton,
  TabsSkeleton,
} from './skeletons'
import { TabLink } from './tab-link'

type Props = {
  list: React.ReactNode
  detail?: React.ReactNode
  isLoading?: boolean
  loadingState?: React.ReactNode
}

const getActionsButtonsData = (address: string | undefined) => ({
  address: address ?? '',
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
})

const SplittedLayout = (props: Props) => {
  const { list, detail, isLoading, loadingState } = props

  return (
    <div className="grid flex-1 divide-x divide-neutral-10 overflow-hidden">
      <div className="flex divide-x divide-default-neutral-20">
        <div className="flex grow flex-col 2xl:basis-1/2">
          <div className="relative flex h-[calc(100vh-56px)] flex-col overflow-auto">
            <StickyHeaderContainer
              isLarge
              className="px-6 xl:px-12"
              leftSlot={<HeaderLeftSlot />}
              rightSlot={<HeaderRightSlot />}
            >
              <div className="relative -mt-8 flex flex-1 flex-col px-3 xl:mt-0 xl:px-12">
                <MainContentBody />
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

// Components
const AccountInfo = () => {
  const { account, isWalletLoading } = usePortfolio()

  if (isWalletLoading) {
    return <AccountSkeleton variant="secondary" />
  }

  return (
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
  )
}

const PortfolioBalance = ({
  variant = 'primary',
}: {
  variant?: 'primary' | 'secondary'
}) => {
  const { summary, isLoading } = usePortfolio()

  if (isLoading) {
    return <BalanceSkeleton variant={variant} />
  }

  return <Balance summary={summary} />
}

const HeaderLeftSlot = () => {
  const { isLoading } = usePortfolio()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 px-3">
        <div className="flex items-center justify-between gap-1.5">
          <AccountSkeleton />
        </div>
        <BalanceSkeleton />
      </div>
    )
  }

  return (
    <>
      <AccountInfo />
      <PortfolioBalance />
    </>
  )
}

const HeaderRightSlot = () => {
  const { isLoading } = usePortfolio()

  if (isLoading) {
    return <TabsSkeleton />
  }

  return (
    <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
      <TabLink
        href="/portfolio/assets"
        className="w-full justify-center text-center sm:w-fit"
      >
        Assets
      </TabLink>
      <TabLink href="/portfolio/collectibles">Collectibles</TabLink>
      <TabLink href="/portfolio/activity">Activity</TabLink>
    </div>
  )
}

const MainContentBody = () => {
  const { account, isLoading } = usePortfolio()
  const { currentWallet, isLoading: isWalletLoading } = useWallet()

  const address = currentWallet?.activeAccounts[0].address

  if (isLoading || isWalletLoading) {
    return (
      <div className="flex flex-col gap-2 px-3">
        <div className="flex items-center justify-between gap-1.5">
          <Skeleton
            height={27}
            width={186}
            className="rounded-10"
            variant="secondary"
          />
        </div>
        <div className="mt-1">
          <BalanceSkeleton variant="secondary" />
        </div>
        <div className="my-5 flex items-center justify-between">
          <ActionButtonsSkeleton />
          <Skeleton
            height={32}
            width={32}
            className="rounded-10"
            variant="secondary"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="mb-5 flex flex-col gap-2 px-3">
      <div
        className="flex items-center justify-between gap-1.5"
        data-customisation={account.color}
      >
        <AccountInfo />
        <div data-customisation="blue">
          <RecoveryPhraseBackup />
        </div>
      </div>

      <div className="mb-4">
        <PortfolioBalance variant="secondary" />
      </div>

      <ActionButtons {...getActionsButtonsData(address)} />
    </div>
  )
}
