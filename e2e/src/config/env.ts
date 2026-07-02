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

  // Read default MetaMask version from package.json (single source of truth)
  const pkg = JSON.parse(
    fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'),
  ) as { config: { metamaskVersion: string } }

  // Build Anvil RPC URLs from port env vars (same vars as docker-compose.anvil.yml)
  const mainnetPort = process.env.MAINNET_FORK_PORT ?? '8547'
  const lineaPort = process.env.LINEA_FORK_PORT ?? '8546'

  const config: EnvConfig = {
    BASE_URL: process.env.BASE_URL ?? 'http://localhost:3003',
    WALLET_SEED_PHRASE: process.env.WALLET_SEED_PHRASE ?? '',
    WALLET_PASSWORD: process.env.WALLET_PASSWORD ?? '',
    METAMASK_EXTENSION_PATH: resolveExtensionPath(rootDir),
    METAMASK_VERSION:
      process.env.METAMASK_VERSION ?? pkg.config.metamaskVersion,
    ANVIL_MAINNET_RPC:
      process.env.ANVIL_MAINNET_RPC || `http://localhost:${mainnetPort}`,
    ANVIL_LINEA_RPC:
      process.env.ANVIL_LINEA_RPC || `http://localhost:${lineaPort}`,
    // status-api backend the wallet extension talks to (dev target baked into
    // the wallet build). Wallet-extension tests run apps/api here.
    WALLET_STATUS_API_URL:
      process.env.WALLET_STATUS_API_URL ?? 'http://localhost:3030',
  }

  cachedConfig = config
  return config
}

/**
 * Derive the test wallet address from the seed phrase.
 *
 * The harness onboards MetaMask by importing WALLET_SEED_PHRASE, so the
 * connected account is always that seed's account 0 (m/44'/60'/0'/0/0). On-chain
 * helpers derive the same account here, so funding always targets the account
 * the dApp reads — there is no separate address to keep in sync.
 */
export function deriveWalletAddress(seedPhrase: string): string {
  try {
    return mnemonicToAccount(seedPhrase).address
  } catch (error) {
    throw new Error(
      'Could not derive a wallet address from WALLET_SEED_PHRASE: ' +
        `${error instanceof Error ? error.message : error}`,
    )
  }
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
