/** Browser viewport dimensions */
export const VIEWPORT = {
  WIDTH: 1440,
  HEIGHT: 900,
} as const

/** Timeouts for browser extension service workers and pages */
export const EXTENSION_TIMEOUTS = {
  /** Time to wait for MetaMask service worker to register */
  SERVICE_WORKER: 30_000,
  /** Time to wait for MetaMask extension page to appear */
  EXTENSION_PAGE: 10_000,
} as const

/** Timeouts for MetaMask notification popup interactions */
export const NOTIFICATION_TIMEOUTS = {
  /** Time to wait for notification popup to appear */
  POPUP_APPEAR: 30_000,
  /** Time to wait for a UI element to become visible */
  ELEMENT_VISIBLE: 5_000,
  /** Time to wait for button state transitions (disabled/enabled) */
  BUTTON_TRANSITION: 10_000,
  /** Time to wait for transaction confirm button */
  TRANSACTION_CONFIRM: 15_000,
  /** Time to wait for optional UI elements (e.g., "Use default" button) */
  OPTIONAL_ELEMENT: 3_000,
  /**
   * Time to wait for notification page content to appear after opening.
   * MetaMask v13 processes transactions asynchronously: gas estimation,
   * fee calculation, and Blockaid security simulation must complete before
   * the confirmation UI appears. This can take 10-60 seconds.
   */
  NOTIFICATION_CONTENT: 45_000,
} as const

/** Timeouts for MetaMask onboarding flow */
export const ONBOARDING_TIMEOUTS = {
  /** Delay between keystrokes when entering seed phrase (ms per character) */
  SEED_PHRASE_TYPING_DELAY: 30,
  /** Time to wait for post-onboarding popups */
  POPUP_DISMISS: 3_000,
} as const

/** Timeouts for hub page interactions */
export const HUB_TIMEOUTS = {
  /** Time to wait for page heading to become visible */
  PAGE_READY: 15_000,
} as const

/** Timeouts used in test specs */
export const TEST_TIMEOUTS = {
  /** Time to wait for MetaMask onboarding UI elements */
  ONBOARDING_ELEMENT: 15_000,
} as const

/** Timeouts for deposit transaction flows */
export const DEPOSIT_TIMEOUTS = {
  /** Time to wait for action button text to change after a tx confirms */
  BUTTON_STATE_CHANGE: 30_000,
  /** Time to wait for modal to close after successful deposit */
  MODAL_CLOSE: 30_000,
} as const
