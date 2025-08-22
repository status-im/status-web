import { ROUTES } from '~/config/routes'
import { AnimatedFrames } from './animated-frames'
import { ButtonLink } from './button-link'
import { Divider } from './divider'

const PreFooter = () => {
  return (
    <section className="relative w-full">
      <Divider />
      <div className="relative z-[60] p-2">
        <div className="flex items-center justify-center px-3 py-[120px] lg:px-[120px]">
          <div className="flex max-w-[686px] flex-col items-center justify-between gap-8">
            <div className="flex flex-col items-center pt-8">
              <p className="max-w-[340px] text-center text-40 font-600 text-white-100 sm:max-w-[420px] lg:max-w-max lg:text-64">
                Ready to build on the free network?
              </p>
            </div>
            <div className="flex gap-3">
              <ButtonLink href={ROUTES.Partner} variant="primary">
                Partner with us
              </ButtonLink>
              <ButtonLink href={ROUTES.Docs} variant="secondary">
                Read docs
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
      {/* Desktop */}
      <AnimatedFrames
        className="absolute bottom-1/2 left-[-176px] z-50 hidden w-[calc(100%+280px)] max-w-none translate-y-1/2 md:-left-28 md:block md:w-[calc(100%+140px)] lg:-left-36 lg:w-[calc(100%+120px)]"
        images={[
          '/prefooter/dragon-desktop-01.png',
          '/prefooter/dragon-desktop-02.png',
          '/prefooter/dragon-desktop-03.png',
          '/prefooter/dragon-desktop-04.png',
          '/prefooter/dragon-desktop-05.png',
          '/prefooter/dragon-desktop-04.png',
          '/prefooter/dragon-desktop-03.png',
          '/prefooter/dragon-desktop-02.png',
        ]}
        interval={100}
        width={1595}
        height={727}
        alt="Dragon spitting fire"
      />
      {/* Mobile */}
      <AnimatedFrames
        className="absolute left-1/2 top-[36%] z-50 w-[calc(100vw+540px)] max-w-[591px] -translate-x-1/2 -translate-y-1/2 md:hidden md:w-full"
        images={[
          '/prefooter/dragon-mobile-01.png',
          '/prefooter/dragon-mobile-02.png',
          '/prefooter/dragon-mobile-03.png',
          '/prefooter/dragon-mobile-04.png',
          '/prefooter/dragon-mobile-05.png',
          '/prefooter/dragon-mobile-04.png',
          '/prefooter/dragon-mobile-03.png',
          '/prefooter/dragon-mobile-02.png',
        ]}
        interval={100}
        width={591}
        height={585}
        alt="Dragon spitting fire"
      />
    </section>
  )
}

export { PreFooter }
