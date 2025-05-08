import { Suspense } from 'react'

import { Skeleton } from '@status-im/components'
import { StickyHeaderContainer } from '@status-im/wallet/components'
import { AccountMenu } from 'src/app/_components/account-menu'
import { Address } from 'src/app/_components/address'

import { ActionBar } from '../../_components/action-bar'
import { ActionButtons } from '../../_components/action-buttons'
import { NetworksFilter } from '../../_components/network-filter'

type Props = {
  children: React.ReactNode
  summary: React.ReactNode
  balance: React.ReactNode
}

export default function ListSlotLayout({ children, ...rest }: Props) {
  const { summary, balance: totalBalance } = rest

  return (
    <StickyHeaderContainer
      leftSlot={
        <Suspense
          fallback={
            <div className="flex items-center gap-2">
              <Skeleton
                height={20}
                width={20}
                className="rounded-10"
                variant="secondary"
              />
              <Skeleton
                height={20}
                width={160}
                className="rounded-10"
                variant="secondary"
              />
            </div>
          }
        >
          {summary}
        </Suspense>
      }
      rightSlot={<AccountMenu size="32" />}
      secondaryLeftSlot={<ActionButtons />}
    >
      <div className="relative flex flex-1 flex-col">
        <div className="grid gap-6 p-12 pt-0">
          <div className="flex flex-col gap-2">
            <Address variant="address-info" />
            <div className="mb-6">
              <div className="flex items-start gap-2">
                <Suspense
                  fallback={
                    <div className="mt-[10px] flex flex-col gap-3">
                      <Skeleton
                        height={20}
                        width={160}
                        className="rounded-10"
                        variant="secondary"
                      />
                      <div className="flex items-center gap-1">
                        <Skeleton
                          height={14}
                          width={14}
                          className="rounded-10"
                          variant="secondary"
                        />
                        <Skeleton
                          height={14}
                          width={36}
                          className="rounded-10"
                          variant="secondary"
                        />
                        <Skeleton
                          height={2}
                          width={2}
                          className="rounded-10"
                          variant="secondary"
                        />
                        <Skeleton
                          height={14}
                          width={60}
                          className="rounded-10"
                          variant="secondary"
                        />
                      </div>
                    </div>
                  }
                >
                  <div className="pt-1">{totalBalance}</div>
                </Suspense>
                <div className="pt-2">
                  <NetworksFilter />
                </div>
              </div>
            </div>
            <ActionButtons />
          </div>
          {children}
        </div>
      </div>
      <ActionBar />
    </StickyHeaderContainer>
  )
}
