'use client'

import { useAccounts } from '../_providers/accounts-context'

import type { ReactNode } from 'react'

export function AccountRoute({ children }: { children: ReactNode }) {
  const { accountsLoaded } = useAccounts()

  // The account UI must wait until watched addresses have loaded from storage.
  return accountsLoaded ? children : <div>Loading...</div>
}
