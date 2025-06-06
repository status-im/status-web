import { TRPCError } from '@trpc/server'

import type { DataTransformer } from '@trpc/server/unstable-core-do-not-import'

export function safeDeserialize<T>(
  transformer: DataTransformer,
  data: unknown,
): T {
  try {
    return transformer.deserialize(data)
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Failed to deserialize input data',
      cause: error,
    })
  }
}

export function safeSerialize<T>(
  transformer: DataTransformer,
  data: T,
): unknown {
  try {
    return transformer.serialize(data)
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Failed to serialize output data',
      cause: error,
    })
  }
}
