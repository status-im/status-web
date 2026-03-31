declare namespace NodeJS {
  export interface ProcessEnv {
    ENV: 'development' | 'preview' | 'production'
  }
}
