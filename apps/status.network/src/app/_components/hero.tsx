import { ChevronRightIcon } from '@status-im/icons/16'
import { ROUTES } from '~/config/routes'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatedField } from './animated-field'
import { ButtonLink } from './button-link'

const Hero = () => {
  return (
    <section className="relative z-20 my-2 w-full px-2 text-15 lg:mb-8">
      <div className="relative min-h-[713px] rounded-32 bg-sea lg:min-h-[923px]">
        <div className="absolute inset-0 h-full overflow-hidden rounded-32 lg:overflow-visible">
          <Image
            src="/hero/landscape.png"
            alt="Landscape"
            className="absolute bottom-0 left-1/2 min-w-[728px] -translate-x-1/2 object-cover lg:-bottom-6"
            priority
            width={1400}
            height={486}
          />
        </div>
        <AnimatedField />
        <div className="relative px-4 pb-20 pt-14 lg:pt-24">
          <div className="flex flex-col items-center text-center text-white-100">
            <Link href={ROUTES.Bridge}>
              <div className="mb-4 inline-flex items-center gap-0.5 rounded-full bg-white-10 py-1 pl-1 pr-[6px] backdrop-blur-sm">
                <span className="mr-[6px] rounded-full bg-gradient-to-r from-purple from-70% to-[#756ECB91] px-2 pb-[3.5px] pt-[2.5px] text-13 font-500">
                  NEW
                </span>
                <span className="text-15 text-white-100">Testnet is live!</span>
                <ChevronRightIcon className="text-white-40" />
              </div>
            </Link>

            <h1 className="mb-5 text-56 font-600 lg:text-64">
              The gasless network
            </h1>

            <h2 className="mb-6 text-27 font-500 lg:text-40">
              with sustainable funding for app builders
            </h2>

            <p className="mb-8 max-w-[558px] text-19 text-white-90 sm:text-27">
              Launch and scale your social apps and games with truly free
              transactions.
            </p>

            <div className="flex space-x-3">
              <ButtonLink href={ROUTES.Bridge} variant="primary">
                Get started
              </ButtonLink>
              <ButtonLink href={ROUTES.Docs} variant="secondary">
                Read docs
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export { Hero }
