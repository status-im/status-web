/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly WXT_STATUS_API_URL: string
  readonly WXT_GETBLOCK_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
