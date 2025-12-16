'use client'

import { BulletIcon, ExternalIcon } from '@status-im/icons/20'
import { FEATURES } from '~/config/routes'
import { useTranslations } from 'next-intl'
import { AnimatedFrames } from './animated-frames'
import { ButtonLink } from './button-link'
import { Divider } from './divider'

const Features = () => {
  const t = useTranslations()

  return (
    <section className="relative w-full scroll-mt-16" id="features">
      <div className="flex flex-col lg:flex-row">
        <div className="bg-[#1B273D05] lg:sticky lg:top-16 lg:h-[calc(100vh-6rem)] lg:max-w-[50%] lg:flex-shrink-0">
          <div className="px-4 py-20 lg:p-12">
            <p className="mb-6 inline-block text-13 font-500 text-purple">
              {t('features.section_number.translation')}{' '}
              <span className="inline-block h-2 w-px bg-purple-transparent" />{' '}
              {t('features.section_title.translation')}
            </p>
            <h2 className="text-40 font-600 lg:text-64">
              {t('features.title.translation')}
            </h2>
          </div>
        </div>
        <div className="block lg:hidden">
          <Divider />
        </div>

        <div className="w-full border-neutral-80/10 lg:border-l lg:py-12">
          <div className="space-y-12">
            <div className="flex flex-col gap-4 px-4 pt-12 text-19 lg:px-12 lg:py-0 xl:max-w-[540px] xl:pr-0">
              <h3 className="text-27 font-600 lg:mb-1 lg:text-40">
                {t('features.sustainable_funding.title.translation')}
              </h3>
              <p>{t('features.sustainable_funding.description.translation')}</p>
              <ol className="mb-4 space-y-4">
                <li className="flex gap-3 lg:gap-4">
                  <div className="mt-1 flex h-[22px] w-5 flex-shrink-0 items-center justify-center rounded-8 border border-neutral-20 text-13 font-500">
                    1
                  </div>
                  <p>{t('features.sustainable_funding.step_1.translation')}</p>
                </li>
                <li className="flex gap-3 lg:gap-4">
                  <div className="mt-1 flex h-[22px] w-5 flex-shrink-0 items-center justify-center rounded-8 border border-neutral-20 text-13 font-500">
                    2
                  </div>
                  <div>
                    <p className="mb-4">
                      {t('features.sustainable_funding.step_2.translation')}
                    </p>
                    <div className="ml-6 list-disc space-y-2 marker:text-neutral-50">
                      <p className="flex items-center gap-1">
                        <BulletIcon className="text-neutral-50" />{' '}
                        {t(
                          'features.sustainable_funding.step_2_staking.translation',
                        )}
                      </p>
                      <p className="flex items-center gap-1">
                        <BulletIcon className="text-neutral-50" />
                        {t(
                          'features.sustainable_funding.step_2_bridging.translation',
                        )}
                      </p>
                      <p className="flex items-center gap-1">
                        <BulletIcon className="text-neutral-50" />
                        {t(
                          'features.sustainable_funding.step_2_using.translation',
                        )}
                      </p>
                      <p className="flex items-center gap-1">
                        <BulletIcon className="text-neutral-50" />
                        {t(
                          'features.sustainable_funding.step_2_premium.translation',
                        )}
                      </p>
                      <p className="flex items-center gap-1">
                        <BulletIcon className="text-neutral-50" />
                        {t(
                          'features.sustainable_funding.step_2_donations.translation',
                        )}
                      </p>
                    </div>
                  </div>
                </li>
                <li className="flex gap-3 lg:gap-4">
                  <div className="mt-1 flex h-[22px] w-5 flex-shrink-0 items-center justify-center rounded-8 border border-neutral-20 text-13 font-500">
                    3
                  </div>
                  <p>{t('features.sustainable_funding.step_3.translation')}</p>
                </li>
              </ol>
              <ButtonLink
                href={FEATURES.sustainablePublicFunding.href}
                variant="white"
              >
                {t('features.sustainable_funding.button.translation')}
              </ButtonLink>
              <AnimatedFrames
                images={[
                  '/features/pig-1.png',
                  '/features/pig-2.png',
                  '/features/pig-3.png',
                ]}
                className="mt-6"
                width={112}
                height={112}
                alt="Sustainable public funding"
              />
            </div>

            <Divider variant="left" />

            <div className="flex flex-col gap-4 px-4 text-19 lg:px-12 xl:max-w-[540px]">
              <h3 className="text-27 font-600 lg:mb-1 lg:text-40">
                {t('features.gasless_transactions.title.translation')}
              </h3>
              <p>
                {t('features.gasless_transactions.description_1.translation')}
              </p>
              <p className="mb-4">
                {t('features.gasless_transactions.description_2.translation')}
              </p>
              <ButtonLink
                href={FEATURES.gaslessTransactions.href}
                variant="white"
              >
                {t('features.gasless_transactions.button.translation')}
              </ButtonLink>
              <AnimatedFrames
                images={[
                  '/features/unicorn-1.png',
                  '/features/unicorn-2.png',
                  '/features/unicorn-3.png',
                ]}
                className="mt-6"
                width={112}
                height={112}
                delay={300}
                alt="Gasless Transactions"
              />
            </div>

            <Divider variant="left" />

            <div className="flex flex-col gap-4 px-4 text-19 lg:px-12 xl:max-w-[540px]">
              <h3 className="text-27 font-600 lg:mb-1 lg:text-40">
                {t('features.performance.title.translation')}
              </h3>
              <p className="mb-4">
                {t('features.performance.description.translation')}
              </p>
              <ButtonLink
                variant="white"
                href={FEATURES.performance.href}
                icon={<ExternalIcon className="text-neutral-50" />}
              >
                {t('features.performance.button.translation')}
              </ButtonLink>
              <AnimatedFrames
                images={['/features/kite-1.png', '/features/kite-2.png']}
                className="mt-6"
                width={112}
                height={112}
                delay={500}
                alt="Built for performance, secured by Ethereum"
              />
            </div>

            <Divider variant="left" />

            <div className="flex flex-col gap-4 px-4 pb-12 text-19 lg:px-12 lg:pb-0 xl:max-w-[540px]">
              <h3 className="text-27 font-600 lg:mb-1 lg:text-40">
                {t('features.decentralization.title.translation')}
              </h3>
              <p className="mb-4">
                {t('features.decentralization.description.translation')}
              </p>
              <ButtonLink
                variant="white"
                href="https://free.technology"
                icon={<ExternalIcon className="text-neutral-50" />}
              >
                {t('features.decentralization.button.translation')}
              </ButtonLink>

              <AnimatedFrames
                images={['/features/planet-1.png', '/features/planet-2.png']}
                className="mt-6"
                width={112}
                height={112}
                delay={700}
                alt="Geared for decentralization"
              />
            </div>
          </div>
        </div>
      </div>
      <Divider hasMiddleCircle />
    </section>
  )
}

export { Features }
