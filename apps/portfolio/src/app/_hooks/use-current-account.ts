'use client'

import { notFound, useParams } from 'next/navigation'

import { useAccounts } from '../_providers/accounts-context'

export function useCurrentAccount() {
  const { address } = useParams<{ address: string }>()
  const { accounts } = useAccounts()

  const normalizedAddress = address.toLowerCase()
  const currentAccount = accounts.find(
    account => account.address?.toLowerCase() === normalizedAddress
  )

  if (!currentAccount) {
    notFound()
  }

  return currentAccount
}
