'use client'

import { useAccounts } from '../_providers/accounts-context'
import { SideNav } from './sidenav'

export const AccountSideNav = () => {
  const { activeAccounts, accountsData } = useAccounts()

  const enrichedAccounts = activeAccounts.map(account => ({
    ...account,
    href: `/${account.address}/assets`,
    paired: false,
    amount: accountsData[account.address]?.summary?.total_eur || 0,
  }))

  return <SideNav links={enrichedAccounts} />
}
