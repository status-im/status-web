export const NOTIFICATIONS_ENABLED_KEY = 'local:notifications:enabled' as const
export const TX_NOTIFIED_KEY = 'local:tx-monitor:notified' as const
/** Consecutive polls denying a hash, keyed by hash. */
export const TX_MISSES_KEY = 'local:tx-monitor:misses' as const
export const PENDING_TXS_KEY =
  'local:pending-transactions:transactions' as const
export const NOTIFICATION_PROMPTED_KEY = 'local:notifications:prompted' as const
export const SELECTED_WALLET_ID_KEY = 'local:wallet:selected-id' as const
