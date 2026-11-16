import { z } from 'zod'

export const SUPPORTED_NETWORKS = ['ethereum'] as const

const networkSchema = z.enum(SUPPORTED_NETWORKS)

/**
 * Networks input shared by routers. Duplicates are removed so each network is
 * fetched once, then the length is capped to the number of supported networks.
 */
export const networksSchema = z
  .array(networkSchema)
  .transform(networks => [...new Set(networks)])
  .pipe(z.array(networkSchema).max(SUPPORTED_NETWORKS.length))
