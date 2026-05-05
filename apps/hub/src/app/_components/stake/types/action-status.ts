/**
 * Represents the current state of an action status dialog
 */
export type ActionStatusState =
  | 'pending' // Waiting for user action (sign, approve)
  | 'processing' // Transaction in progress
  | 'error' // Failed/rejected
  | 'success' // Completed successfully

/**
 * Content configuration for action status dialog
 */
export interface ActionStatusContent {
  state: ActionStatusState
  title?: string
  description?: string
  showCloseButton?: boolean
  content?: React.ReactNode
}
