import Image from 'next/image'

import { AnimatedField } from './animated-field'

const Hero = () => {
  return (
    <section className="relative z-20 mx-auto mt-0 w-full max-w-[1176px]">
      <div className="relative min-h-[342px] rounded-32 lg:min-h-[682px]">
        <div className="absolute inset-0 h-full overflow-hidden rounded-32">
          <Image
            src="/hero/landscape.png"
            alt="Landscape"
            className="absolute left-1/2 -translate-x-1/2 rounded-32 object-cover lg:top-0"
            priority
            width={1400}
            height={486}
          />
        </div>

        <AnimatedField />

        <div className="relative p-12">
          <div className="flex flex-col items-start text-left text-white-100">
            <h1 className="mb-5 text-56 font-600 lg:text-64">
              Get started <br /> on the free network
            </h1>

            <p className="mb-8 max-w-[558px] text-19 text-white-90 sm:text-27">
              Try apps and deposit assets to earn Karma
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export { Hero }
