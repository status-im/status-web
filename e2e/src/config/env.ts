import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

export interface EnvConfig {
  BASE_URL: string;
  WALLET_SEED_PHRASE: string;
  WALLET_PASSWORD: string;
  METAMASK_EXTENSION_PATH: string;
  METAMASK_EXTENSION_ID: string;
  CHROME_VERSION: string;
  STATUS_SEPOLIA_RPC_URL: string;
  STATUS_SEPOLIA_CHAIN_ID: string;
}

let cachedConfig: EnvConfig | null = null;

export function loadEnvConfig(): EnvConfig {
  if (cachedConfig) return cachedConfig;

  const rootDir = path.resolve(import.meta.dirname, '../..');
  dotenv.config({ path: path.join(rootDir, '.env.local') });
  dotenv.config({ path: path.join(rootDir, '.env') });

  const config: EnvConfig = {
    BASE_URL: process.env.BASE_URL ?? 'https://hub.status.network',
    WALLET_SEED_PHRASE: process.env.WALLET_SEED_PHRASE ?? '',
    WALLET_PASSWORD: process.env.WALLET_PASSWORD ?? 'TestPassword123!',
    METAMASK_EXTENSION_PATH: resolveExtensionPath(rootDir),
    METAMASK_EXTENSION_ID:
      process.env.METAMASK_EXTENSION_ID ?? 'nkbihfbeogaeaoehlefnkodbefgpgknn',
    CHROME_VERSION: process.env.CHROME_VERSION ?? '131.0.0.0',
    STATUS_SEPOLIA_RPC_URL:
      process.env.STATUS_SEPOLIA_RPC_URL ??
      'https://public.sepolia.rpc.status.network',
    STATUS_SEPOLIA_CHAIN_ID:
      process.env.STATUS_SEPOLIA_CHAIN_ID ?? '1660990954',
  };

  cachedConfig = config;
  return config;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Required environment variable ${name} is not set. ` +
        `Copy .env.example to .env and fill in the values.`,
    );
  }
  return value;
}

/** Require WALLET_SEED_PHRASE — only called when wallet tests actually run */
export function requireWalletSeedPhrase(): string {
  return requireEnv('WALLET_SEED_PHRASE');
}

function resolveExtensionPath(rootDir: string): string {
  const envPath = process.env.METAMASK_EXTENSION_PATH;
  if (envPath) {
    return path.isAbsolute(envPath) ? envPath : path.resolve(rootDir, envPath);
  }

  const dotPath = path.resolve(rootDir, '.extensions', 'metamask');
  const plainPath = path.resolve(rootDir, 'extensions', 'metamask');

  if (fs.existsSync(dotPath)) return dotPath;
  if (fs.existsSync(plainPath)) return plainPath;
  return dotPath;
}
