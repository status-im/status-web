import { useProtocol } from '~/src/protocol'

import type { Member } from '@status-im/js'

// todo: remove in favor of useCommunity
export const useMembers = (): Member[] => {
  const { client } = useProtocol()

  return client.community.members
}

export type { Member }
