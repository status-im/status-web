// /// <reference types="vite/client" />

// // import 'vite/client'

interface ImportMeta {
  readonly env: {
    readonly WXT_STATUS_API_URL: string
    readonly WXT_ETHERSCAN_API_KEY: string
    readonly WXT_GETBLOCK_API_KEY: string
  }
}
