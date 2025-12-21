import { ExternalIcon } from '@status-im/icons/12'
import { ButtonLink } from './button-link'

const PromoBar = () => {
  return (
    <div
      className="flex h-auto w-full flex-col items-center justify-center gap-2 bg-purple px-2 py-2 lg:h-8 lg:flex-row lg:py-0"
      data-theme="dark"
    >
      <p className="text-center text-15 font-500 text-white-100">
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
  )
}

export { PromoBar }
