import { useProtocol } from './use-protocol'

import type { Account } from '@status-im/js'

export const useAccount = () => {
  const { client, account } = useProtocol()

  return {
    account,
    createAccount: () => client.createAccount(),
    deleteAccount: () => client.deleteAccount(),
    isMember: account?.membership === 'approved',
  } as const
}

export type { Account }
