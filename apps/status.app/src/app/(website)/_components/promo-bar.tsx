import { ExternalIcon } from '@status-im/icons/12'
import { cx } from 'class-variance-authority'

const PromoBar = () => {
  return (
    <div
      className="flex h-auto bg-customisation-purple-50 p-2 md:h-8 md:p-0"
      data-theme="light"
    >
      <div className="mx-auto flex flex-col items-center justify-center gap-2 md:flex-row">
        <p className="text-15 font-500 text-white-100">
          Pre-deposit SNT ahead of Status Network mainnet launch!
        </p>
        <a
          href="https://hub.status.network/pre-deposits?utm_source=ecosystem&utm_medium=referral&utm_campaign=app"
          className={cx(
            'inline-flex w-fit cursor-pointer select-none items-center gap-1 border text-15 font-500 transition-all',
            'border-neutral-30 text-white-100 hover:border-neutral-40 hover:text-white-80',
            'disabled:cursor-default disabled:opacity-[0.3]',
            'h-6 rounded-8 pl-2 pr-[6px]'
          )}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit hub (opens in new tab)"
        >
          Visit hub <ExternalIcon />
        </a>
      </div>
    </div>
  )
}

export { PromoBar }
