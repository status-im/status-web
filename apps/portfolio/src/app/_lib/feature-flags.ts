import { clientEnv } from '../../config/env.client.mjs'

export type FeatureFlag = keyof typeof FEATURE_FLAGS

export const FEATURE_FLAGS = {
  WATCHED_ADDRESSES:
    clientEnv.NEXT_PUBLIC_FEATURE_FLAG_WATCHED_ADDRESSES === 'true',
} as const
