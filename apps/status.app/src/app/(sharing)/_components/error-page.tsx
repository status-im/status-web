import { Button, Text } from '@status-im/components'

import { Image } from '~components/assets'
import { ERROR_CODES } from '~sharing/_error-codes'

type Props = {
  errorCode: (typeof ERROR_CODES)[keyof typeof ERROR_CODES]
}

export const ErrorPage = (props: Props) => {
  const { errorCode } = props

  switch (errorCode) {
    // todo!: design review, not in designs
    case ERROR_CODES.NOT_FOUND: // no encoded data or otherwise not found data in waku (e.g. retention, invalid pk or ens)
    case ERROR_CODES.INTERNAL_SERVER_ERROR:
    default:
      return (
        <div className="flex size-full min-h-screen flex-col items-center justify-center bg-white-100 text-center">
          <Image
            className="mb-5"
            id="404 Error/Other Errors/Error_All_1:942:732"
            alt="Illustration representing the loading error in the Status.app website"
            width={314}
            height={244}
          />

          <div className="mb-3 flex flex-col gap-2 py-3">
            <Text size={27} weight="semibold">
              Oh no! Something went wrong!
            </Text>
            <Text size={19} weight="regular">
              Try to reload the page or come back later!
            </Text>
          </div>

          <Button variant="outline" href="/">
            Go to status.app homepage
          </Button>
        </div>
      )
  }
}
