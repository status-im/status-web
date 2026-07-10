import path from 'node:path'

/** Built (dev-mode) Status wallet extension, loaded unpacked. */
export const WALLET_EXTENSION_PATH = path.resolve(
  import.meta.dirname,
  '../../../apps/wallet/.output/chrome-mv3',
)

/** Extension page entrypoint (flattened by wxt — not page/index.html). */
export const WALLET_PAGE = 'page.html'

/**
 * Password the wallet CREATES during onboarding. Must satisfy the create-password
 * rules (>=12 chars, lower + upper + number + symbol). Independent of the seed
 * and of MetaMask's WALLET_PASSWORD (which is not compliant).
 */
export const WALLET_TEST_PASSWORD = 'Status123!test'

/**
 * The wallet's full detail/action UI (Buy/Exchange/Send) only renders in the
 * wide split-view; narrower viewports collapse the detail panel.
 */
export const WALLET_VIEWPORT = { width: 1920, height: 1080 }

/** ETH funded to the wallet on the mainnet fork before each test. */
export const WALLET_FUND_ETH = 10
