export const CLUSTER_ID = 16
export const SHARDS = [32, 128, 256] as const

export const getShardInfo = () => ({
  clusterId: CLUSTER_ID,
  shards: [...SHARDS],
})

export const getRoutingInfo = (shardId: number) => ({
  clusterId: CLUSTER_ID,
  shardId,
  pubsubTopic: `/waku/2/rs/${CLUSTER_ID}/${shardId}`,
})
