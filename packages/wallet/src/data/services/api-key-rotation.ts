import { serverEnv } from '../../config/env.server.mjs'

type ApiService = 'alchemy' | 'cryptocompare'

const serviceConfig = {
  alchemy: {
    keys: [
      serverEnv.ALCHEMY_API_KEY,
      serverEnv.ALCHEMY_API_KEY_ROTATION_2,
    ].filter(Boolean),
    name: 'Alchemy',
  },
  cryptocompare: {
    keys: [
      serverEnv.CRYPTOCOMPARE_API_KEY,
      serverEnv.CRYPTOCOMPARE_API_KEY_ROTATION_2,
    ].filter(Boolean),
    name: 'CryptoCompare',
  },
} as const

export function getApiKey(service: ApiService): string {
  const config = serviceConfig[service]
  const availableKeys = config.keys

  if (availableKeys.length === 0) {
    throw new Error(`No ${config.name} API keys configured`)
  }

  const selectedIndex = Math.floor(Math.random() * availableKeys.length)
  const selectedKey = availableKeys[selectedIndex]

  return selectedKey
}
