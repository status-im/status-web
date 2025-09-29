import { ROUTES } from '~/config/routes'
import { AnimatedFrames } from './animated-frames'
import { ButtonLink } from './button-link'
import { Divider } from './divider'

const About = () => {
  return (
    <section className="relative w-full" id="about">
      <div className="absolute left-0 top-0 z-10 h-full w-40 bg-gradient-to-r from-white-100 via-white-40 to-[transparent]" />
      <div className="absolute right-0 top-0 z-10 h-full w-40 bg-gradient-to-l from-white-100 via-white-40 to-[transparent]" />
      <div className="absolute left-0 top-0 z-10 h-40 w-full bg-gradient-to-b from-white-100 via-white-40 to-[transparent]" />
      <div className="absolute bottom-0 left-0 z-10 h-40 w-full bg-gradient-to-t from-white-100 via-white-40 to-[transparent]" />
      <div className="pointer-events-none absolute inset-0 bg-[url('/dashed-columns.svg')] bg-[size:40px_100%]" />
      <div className="relative z-10">
        <Divider />
      </div>
      <div className="relative z-20 px-5 pb-[242px] pt-[120px] lg:px-[120px] lg:py-40">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-[936px]">
            <div className="mb-8">
              <p className="mb-6 inline-block text-13 font-500 text-purple">
                01{' '}
                <span className="inline-block h-2 w-px bg-purple-transparent" />{' '}
                WHAT IS STATUS NETWORK?
              </p>
              <h2 className="mb-2 text-40 font-600 lg:text-64">
                The first Ethereum L2 with{' '}
                <span className="whitespace-nowrap">gas-free</span> transactions
                at scale{' '}
                <span className="text-40 font-600 text-neutral-80/60 md:text-64">
                  funded by native yield + fees.
                </span>
              </h2>
            </div>

            <p className="mb-8 max-w-[816px] text-27">
              A free network with sustainable funding for public apps, games and
              protocols.
            </p>

            <div className="flex gap-3">
              <ButtonLink href={ROUTES.Partner}>
                Build on Status Network
              </ButtonLink>
              <ButtonLink variant="white" href={ROUTES.Docs}>
                Learn more
              </ButtonLink>
            </div>
          </div>
        </div>

        <AnimatedFrames
          className="absolute bottom-0 right-0 z-20 w-[240px] object-contain lg:w-[386px]"
          images={['/waifu-eyes-open.png', '/waifu-eyes-closed.png']}
          interval={1200}
          width={386}
          height={358}
          alt="Girl blinking eyes"
        />
      </div>
      <Divider />
    </section>
  )
}

export { About }
