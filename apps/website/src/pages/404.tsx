// todo: user per preiview page only
import { ErrorPage } from '@/components/error-page'
import { ERROR_CODES } from '@/consts/error-codes'

export default function Custom404() {
  return <ErrorPage errorCode={ERROR_CODES.NOT_FOUND} />
}
