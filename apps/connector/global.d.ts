import type { Provider } from './src/contents/provider'

declare global {
  interface Window {
    ethereum: Provider
    registration?: ServiceWorkerRegistration
  }
}
