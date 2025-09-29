import type { ApiRouter } from '.'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

type ApiInput = inferRouterInputs<ApiRouter>
type ApiOutput = inferRouterOutputs<ApiRouter>

export type { ApiInput, ApiOutput, ApiRouter }
