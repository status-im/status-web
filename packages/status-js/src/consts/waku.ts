export const CLUSTER_ID = 16
export const SHARDS = [32, 128, 256] as const

export const getRoutingInfo = (shardId: number) => ({
  clusterId: CLUSTER_ID,
  shardId,
  pubsubTopic: `/waku/2/rs/${CLUSTER_ID}/${shardId}`,
})
