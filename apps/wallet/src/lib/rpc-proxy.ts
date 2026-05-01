export const getRpcProxyUrl = (chainId: number = 1) =>
  `${import.meta.env.WXT_STATUS_API_URL}/api/trpc/rpc.proxy?chainId=${chainId}`
