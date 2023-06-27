import { useProtocol } from './use-protocol'

import type { Member } from '@felicio/js'

export const useMembers = (): Member[] => {
  const { client, account } = useProtocol()

  if (account) {
    return client.community.members.filter(
      member => member.publicKey !== '0x' + account.publicKey
    )
  }

  return client.community.members
}

export type { Member }
