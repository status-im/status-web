import { ExternalIcon } from '@status-im/icons/12'
import { cx } from 'class-variance-authority'

const PromoBar = () => {
  return (
    <div
      className="flex max-h-16 min-h-8 w-full items-center bg-customisation-purple-50 p-2 md:justify-center"
      data-theme="light"
    >
      <div className="mx-2 flex w-fit items-center gap-2 lg:mx-auto lg:w-auto lg:justify-center">
        <span className="line-clamp-2 min-w-0 flex-1 overflow-hidden text-15 font-500 text-white-100 lg:line-clamp-1 lg:flex-none lg:truncate">
          Pre-deposit ETH and SNT ahead of Status Network mainnet launch!
        </span>
        <a
          href="https://hub.status.network/pre-deposits?utm_source=ecosystem&utm_medium=referral&utm_campaign=app"
          className={cx(
            'inline-flex w-fit shrink-0 cursor-pointer select-none items-center gap-1 border text-15 font-500 transition-all',
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
