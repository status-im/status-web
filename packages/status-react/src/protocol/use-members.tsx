
import { useCommunity } from '~/src/protocol/use-community'
import { Community } from '@status-im/js'

export type Member = Community['communityMetadata']['members'][0]

export const useMembers = (): string[] => {

  const community = useCommunity()

return Object.keys(community.members)

}
