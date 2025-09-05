import NextImage from 'next/image'

import { BRAND, LEGAL, SOCIALS } from '../../config/routes'
import { Link } from '../link'

const Footer = () => {
  return (
    <footer className="relative z-[61]">
      <div className="grid gap-4 p-3 lg:grid-cols-[1fr,auto,auto] lg:gap-0 lg:p-4">
        <div className="flex flex-col justify-center gap-2 lg:flex-row lg:justify-start lg:gap-3">
          <span className="text-center text-13 lg:text-left">
            © Status Research & Development GmbH
          </span>
          <Dot className="hidden text-neutral-50 lg:block" />
        </div>

        <div className="flex flex-col items-center justify-center gap-3 lg:flex-row lg:justify-end">
          <div className="flex items-center justify-center gap-4 md:gap-3 lg:justify-end">
            <Link
              href={LEGAL.termsOfUse.href}
              className="text-13 text-neutral-50 transition-colors hover:text-neutral-100"
            >
              {LEGAL.termsOfUse.name}
            </Link>

            <Link
              href={LEGAL.privacyPolicy.href}
              className="text-13 text-neutral-50 transition-colors hover:text-neutral-100"
            >
              {LEGAL.privacyPolicy.name}
            </Link>
            <Link
              href={BRAND.href}
              className="text-13 text-neutral-50 transition-colors hover:text-neutral-100"
            >
              {BRAND.name}
            </Link>
          </div>
          <Dot className="2md:hidden text-neutral-50" />
          <div className="flex justify-center gap-6 lg:justify-end">
            {Object.values(SOCIALS).map(social => {
              return (
                <Link
                  href={social.href}
                  key={social.name}
                  className="transition-opacity hover:opacity-[60%]"
                >
                  <NextImage
                    src={social.src}
                    alt={social.name}
                    width={20}
                    height={20}
                  />
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }

const Dot = (props: React.ComponentProps<'svg'>) => (
  <svg
    width="2"
    height="2"
    viewBox="0 0 2 2"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="1" cy="1" r="1" fill="#A1ABBD" />
  </svg>
)
