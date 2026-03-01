import dotenv from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'
import { mnemonicToAccount } from 'viem/accounts'

export type EnvConfig = E2EEnvConfig

let cachedConfig: EnvConfig | null = null

export function loadEnvConfig(): EnvConfig {
  if (cachedConfig) return cachedConfig

  const rootDir = path.resolve(import.meta.dirname, '../..')
  dotenv.config({ path: path.join(rootDir, '.env.local') })
  dotenv.config({ path: path.join(rootDir, '.env') })

  // Build Anvil RPC URLs from port env vars (same vars as docker-compose.anvil.yml)
  const mainnetPort = process.env.MAINNET_FORK_PORT ?? '8547'
  const lineaPort = process.env.LINEA_FORK_PORT ?? '8546'

  // Derive WALLET_ADDRESS from seed phrase if not explicitly set
  const seedPhrase = process.env.WALLET_SEED_PHRASE ?? ''
  let walletAddress = process.env.WALLET_ADDRESS ?? ''
  if (!walletAddress && seedPhrase) {
    walletAddress = mnemonicToAccount(seedPhrase).address
  }

  const config: EnvConfig = {
    BASE_URL: process.env.BASE_URL ?? 'https://hub.status.network',
    WALLET_SEED_PHRASE: seedPhrase,
    WALLET_PASSWORD: process.env.WALLET_PASSWORD ?? '',
    METAMASK_EXTENSION_PATH: resolveExtensionPath(rootDir),
    METAMASK_VERSION: process.env.METAMASK_VERSION ?? '13.18.1',
    ANVIL_MAINNET_RPC:
      process.env.ANVIL_MAINNET_RPC || `http://localhost:${mainnetPort}`,
    ANVIL_LINEA_RPC:
      process.env.ANVIL_LINEA_RPC || `http://localhost:${lineaPort}`,
    WALLET_ADDRESS: walletAddress,
  }

  cachedConfig = config
  return config
}

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `Required environment variable ${name} is not set. ` +
        'Copy .env.example to .env and fill in the values.',
    )
  }
  return value
}

/** Require WALLET_SEED_PHRASE — only called when wallet tests actually run */
export function requireWalletSeedPhrase(): string {
  return requireEnv('WALLET_SEED_PHRASE')
}

/** Require WALLET_PASSWORD — only called when wallet tests actually run */
export function requireWalletPassword(): string {
  return requireEnv('WALLET_PASSWORD')
}

function resolveExtensionPath(rootDir: string): string {
  const envPath = process.env.METAMASK_EXTENSION_PATH
  if (envPath) {
    return path.isAbsolute(envPath) ? envPath : path.resolve(rootDir, envPath)
  }

  const dotPath = path.resolve(rootDir, '.extensions', 'metamask')
  const plainPath = path.resolve(rootDir, 'extensions', 'metamask')

  if (fs.existsSync(dotPath)) return dotPath
  if (fs.existsSync(plainPath)) return plainPath
  return dotPath
}
