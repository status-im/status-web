import { BaseError, UserRejectedRequestError } from 'viem'

export function isUserRejection(error: unknown): boolean {
  return (
    error instanceof BaseError &&
    !!error.walk(e => e instanceof UserRejectedRequestError)
  )
}
