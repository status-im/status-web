import { useProtocol } from './provider'

import type { Account } from '@status-im/js'

export const useAccount = () => {
  const { client, account } = useProtocol()

  return {
    account,
    createAccount: () => client.createAccount(),
    deleteAccount: () => client.deleteAccount(),
    isMember: account ? client.community.isMember(account.chatKey) : undefined,
  } as const
}

export type { Account }
