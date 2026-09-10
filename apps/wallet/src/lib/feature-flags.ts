import { IS_DEVELOPMENT } from './environment'

export const FEATURE_FLAGS = {
  SWAP: IS_DEVELOPMENT,
} as const
