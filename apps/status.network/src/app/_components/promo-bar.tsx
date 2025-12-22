import { ExternalIcon } from '@status-im/icons/12'
import { ButtonLink } from './button-link'

const PromoBar = () => {
  return (
    <div
      className="flex max-h-16 min-h-8 w-full items-center bg-purple px-2 py-2 md:justify-center md:py-0 lg:h-8"
      data-theme="dark"
    >
      <div className="mx-2 flex w-fit items-center gap-2 lg:mx-auto lg:w-auto lg:justify-center">
        <p className="line-clamp-2 min-w-0 flex-1 overflow-hidden text-15 font-500 text-white-100 lg:line-clamp-1 lg:flex-none lg:truncate">
          Pre-deposit SNT ahead of Status Network mainnet launch!
        </p>
        <ButtonLink
          variant="outline"
          size="24"
          icon={<ExternalIcon />}
          href="https://hub.status.network/pre-deposits?utm_source=ecosystem&utm_medium=referral&utm_campaign=app"
          aria-label="Visit hub (opens in new tab)"
          className="shrink-0"
        >
          Visit hub
        </ButtonLink>
      </div>
    </div>
  )
}

export { PromoBar }
