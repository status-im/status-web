import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { AnimatedField } from './animated-field'

const Hero = () => {
  const t = useTranslations()

  return (
    <section className="relative z-20 mx-auto mt-0 w-full max-w-[1176px]">
      <div className="relative min-h-[240px] md:min-h-[450px] md:rounded-32 lg:min-h-[682px]">
        <div className="absolute inset-0 overflow-hidden rounded-16 bg-sea lg:rounded-32">
          <Image
            src="/hero/landscape.png"
            alt={t('hero.landscape_alt')}
            className="size-full object-cover"
            priority
            fill
          />
        </div>

        <AnimatedField />

        <div className="relative px-4 py-[14px] md:p-12">
          <div className="flex flex-col items-start text-left text-white-100">
            <h1 className="mb-1 text-19 font-600 md:mb-5 md:text-56 lg:text-64">
              {t('hero.title').includes('on the free network') ? (
                <>
                  Get started <br /> on the free network
                </>
              ) : (
                t('hero.title')
              )}
            </h1>

            <p className="mb-8 max-w-[180px] text-13 text-white-90 md:max-w-[558px] md:text-19 lg:text-27">
              {t('hero.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export { Hero }
