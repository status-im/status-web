declare namespace NodeJS {
  interface ProcessEnv {
    BASE_URL?: string;
    WALLET_SEED_PHRASE?: string;
    WALLET_PASSWORD?: string;
    METAMASK_EXTENSION_PATH?: string;
    METAMASK_EXTENSION_ID?: string;
    CHROME_VERSION?: string;
    STATUS_SEPOLIA_RPC_URL?: string;
    STATUS_SEPOLIA_CHAIN_ID?: string;
    CI?: string;
  }
}
