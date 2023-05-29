import { ErrorPage } from '@/components/error-page'
import { ERROR_CODES } from '@/consts/error-codes'

export default function Custom500() {
  return <ErrorPage errorCode={ERROR_CODES.INTERNAL_SERVER_ERROR} />
}
