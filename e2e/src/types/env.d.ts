/** Single source of truth for E2E environment variables */
interface E2EEnvConfig {
  BASE_URL: string;
  WALLET_SEED_PHRASE: string;
  WALLET_PASSWORD: string;
  METAMASK_EXTENSION_PATH: string;
  METAMASK_VERSION: string;
  STATUS_SEPOLIA_RPC_URL: string;
  STATUS_SEPOLIA_CHAIN_ID: string;
}

declare namespace NodeJS {
  interface ProcessEnv extends Partial<E2EEnvConfig> {
    CI?: string;
  }
}
