import { useProtocol } from '~/src/protocol'

import type { Community } from '@status-im/js'

export type Member = Community['description']['members'][0]

export const useMembers = (): string[] => {
  const { community } = useProtocol()

  return Object.keys(community.members)
}
