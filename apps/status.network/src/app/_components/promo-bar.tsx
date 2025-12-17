import { ExternalIcon } from '@status-im/icons/12'
import { ButtonLink } from './button-link'

const PromoBar = () => {
  return (
    <div className="flex h-8 bg-purple" data-theme="dark">
      <div className="mx-auto flex items-center justify-center gap-2">
        <p className="text-15 font-500 text-white-100">
          Pre-deposit SNT ahead of Status Network mainnet launch!
        </p>
        <ButtonLink
          variant="outline"
          size="24"
          icon={<ExternalIcon />}
          href="https://hub.status.network/pre-deposits?utm_source=ecosystem&utm_medium=referral&utm_campaign=app"
        >
          Visit hub
        </ButtonLink>
      </div>
    </div>
  )
}

export { PromoBar }
