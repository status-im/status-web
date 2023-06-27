import { Text } from '@felicio/components'

import { ERROR_CODES } from '@/consts/error-codes'

type Props = {
  errorCode: (typeof ERROR_CODES)[keyof typeof ERROR_CODES]
}

export const ErrorPage = (props: Props) => {
  const { errorCode } = props

  switch (errorCode) {
    // todo!: design review, not in designs
    case ERROR_CODES.NOT_FOUND:
      return (
        <div className="bg-white flex h-full w-full flex-col items-center justify-center gap-8 text-center">
          <div className="h-[160px] w-[160px] rounded-full bg-[#b3b3b3]" />
          <Text size={27} weight="semibold">
            Page not found.
          </Text>
        </div>
      )

    case ERROR_CODES.INTERNAL_SERVER_ERROR:
    default:
      return (
        <div className="bg-white flex h-full w-full flex-col items-center justify-center gap-8 text-center">
          <div className="h-[160px] w-[160px] rounded-full bg-[hsla(355,47%,50%,1)]" />
          <div className="flex flex-col gap-2">
            <Text size={27} weight="semibold">
              {"Oh no, something's wrong!"}
            </Text>
            <Text size={19} weight="regular">
              Try reloading the page or come back later!
            </Text>
          </div>
        </div>
      )
  }
}
