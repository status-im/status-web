import { ERROR_CODES } from '@/consts/error-codes'

type Props = {
  errorCode: (typeof ERROR_CODES)[keyof typeof ERROR_CODES]
}

export const ErrorPage = (props: Props) => {
  const { errorCode } = props

  switch (errorCode) {
    case ERROR_CODES.NOT_FOUND:
      return (
        <>
          <h1>Page not found.</h1>
        </>
      )

    case ERROR_CODES.UNVERIFIED_CONTENT:
      return (
        <>
          <h1>Unverified content.</h1>
        </>
      )

    case ERROR_CODES.INTERNAL_SERVER_ERROR:
    default:
      return (
        <>
          <h1>{"Oh no, something's wrong!"}</h1>
          <p>Try reloading the page or come back later!</p>
        </>
      )
  }
}
