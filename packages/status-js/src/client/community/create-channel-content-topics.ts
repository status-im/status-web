import { idToContentTopic } from '../../contentTopic'

export function createChannelContentTopics(
  channelIds: string[],
  communityPublicKey: string
) {
  const channelTopics = channelIds.map(channelId => {
    const id = `${communityPublicKey}${channelId}`
    const channelContentTopic = idToContentTopic(id)

    return channelContentTopic
  })

  return channelTopics
}
