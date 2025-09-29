'use client'

import { ErrorPage } from '~sharing/_components/error-page'
import { ERROR_CODES } from '~sharing/_error-codes'

export default function Error() {
  return <ErrorPage errorCode={ERROR_CODES.INTERNAL_SERVER_ERROR} />
}
