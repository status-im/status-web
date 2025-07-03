import type { ApiRouter } from '.'
import type { Collectible } from './routers/collectibles'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

type ApiInput = inferRouterInputs<ApiRouter>
type ApiOutput = inferRouterOutputs<ApiRouter>

export type { ApiInput, ApiOutput, ApiRouter }

export type NetworkType =
  | 'ethereum'
  | 'optimism'
  | 'arbitrum'
  | 'base'
  | 'polygon'
  | 'bsc'
  | 'sepolia'

export type { Collectible }
