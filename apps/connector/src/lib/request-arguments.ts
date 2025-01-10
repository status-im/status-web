import { z } from 'zod'

/**
 * @see https://eips.ethereum.org/EIPS/eip-1193#request-1
 * @see https://www.jsonrpc.org/specification#request_object
 */
export const RequestArguments = z.object({
  method: z.string(),
  params: z
    .union([z.array(z.unknown()).readonly(), z.record(z.unknown()).optional()])
    .optional(),
})

export type RequestArguments = z.infer<typeof RequestArguments>
