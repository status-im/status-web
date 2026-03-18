import { Tag, Text } from '@status-im/components'
import { cx } from 'class-variance-authority'
import { Caveat } from 'next/font/google'
import { getTranslations } from 'next-intl/server'

import { jsonLD, JSONLDScript } from '~/utils/json-ld'
import { Metadata } from '~app/_metadata'
import { Body } from '~components/body'
import { ParallaxCircle } from '~website/_components/parallax-circle'
import { getStatusJobs } from '~website/_lib/greenhouse'

import { LogoStatus } from './_components/logo-status'
import { Prefooter } from './_components/pre-footer'
import { Principle } from './_components/principle'

import type { Metadata as NextMetadata } from 'next'

const caveat = Caveat({
  variable: '--font-caveat',
  weight: ['700'],
  subsets: ['latin'],
})

export async function generateMetadata(): Promise<NextMetadata> {
  const t = await getTranslations('manifesto')

  return Metadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: '/manifesto',
    },
  })
}

export default async function ManifestoPage() {
  const t = await getTranslations('manifesto')
  const { meta } = await getStatusJobs()

  const jobsCount = meta?.total ?? 0

  const organizationSchema = jsonLD.organization({
    description: t('metaDescription'),
  })

  const PRINCIPLES = [
    {
      number: 'I',
      title: t('libertyTitle'),
      description: t('libertyDescription'),
    },
    {
      number: 'II',
      title: t('censorshipTitle'),
      description: t('censorshipDescription'),
    },
    {
      number: 'III',
      title: t('securityTitle'),
      description: t('securityDescription'),
    },
    {
      number: 'IV',
      title: t('privacyTitle'),
      description: t('privacyDescription'),
    },
    {
      number: 'V',
      title: t('transparencyTitle'),
      description: t('transparencyDescription'),
    },
    {
      number: 'VI',
      title: t('opennessTitle'),
      description: t('opennessDescription'),
    },
    {
      number: 'VII',
      title: t('decentralisationTitle'),
      description: t('decentralisationDescription'),
    },
    {
      number: 'VIII',
      title: t('inclusivityTitle'),
      description: t('inclusivityDescription'),
    },
    {
      number: 'IX',
      title: t('continuanceTitle'),
      description: t('continuanceDescription'),
    },
    {
      number: 'X',
      title: t('resourcefulnessTitle'),
      description: t('resourcefulnessDescription'),
    },
  ]

  return (
    <>
      <JSONLDScript schema={organizationSchema} />
      <Body>
        <div className="container relative flex flex-col items-center py-16 xl:py-40">
          <ParallaxCircle
            color="pink"
            className="left-[-358px] top-[-274px] xl:left-0"
          />
          <div className="mb-4">
            <Tag size="32" label={t('tag')} />
          </div>
          <h1 className="relative z-20 mb-4 text-center text-48 font-bold xl:mb-6 xl:text-88">
            {t('title')}
            <br />
            {t('titleHighlight')}
          </h1>

          <div className="relative z-20 max-w-[574px] whitespace-pre-line text-center">
            <Text size={27}>{t('subtitle')}</Text>
          </div>
          <ParallaxCircle
            color="purple"
            className="top-[420px] hidden xl:right-0 xl:block"
          />
        </div>

        <ParallaxCircle
          color="orange"
          className="left-[-282px] top-[530px] xl:left-0 xl:top-[730px]"
        />

        {/* MISSION */}
        <div className="container relative">
          <div className="flex flex-col items-center">
            <p className="max-w-[702px] text-27 font-regular xl:text-40 xl:font-regular">
              {t('missionText')}
            </p>
          </div>
        </div>

        {/* PRINCIPLES */}
        <div className="relative">
          <ParallaxCircle color="purple" className="left-0" />
          <ParallaxCircle
            color="pink"
            className="left-0 top-[-80px] hidden xl:block"
          />
          <ParallaxCircle color="sky" className="right-0 top-[400px]" />
          <ParallaxCircle color="orange" className="left-[220px] top-[400px]" />
          <ParallaxCircle color="sky" className="right-[200px] top-0" />

          <div className="container relative flex flex-col items-center pb-24 xl:pb-40">
            <div className="z-20 py-24 xl:py-40">
              <div className="mx-16 aspect-[0.855]">
                <LogoStatus />
              </div>
            </div>
            <div
              className={cx(
                'relative flex max-w-[702px] flex-col gap-10',
                caveat.variable
              )}
            >
              <ParallaxCircle
                color="blue"
                className="left-[52px] top-[960px] xl:left-auto xl:right-[-260px] xl:top-0"
              />
              <ParallaxCircle
                color="orange"
                className="bottom-0 left-[-338px] xl:bottom-[76px] xl:left-[-260px]"
              />
              <h2 id="principles" className="scroll-mt-20 text-40 font-600">
                {t('principles')}
              </h2>
              {PRINCIPLES.map((mission, index) => (
                <Principle
                  key={index}
                  number={mission.number}
                  title={mission.title}
                  description={mission.description}
                />
              ))}
            </div>
          </div>

          <Prefooter jobsCount={jobsCount} />
        </div>
      </Body>
    </>
  )
}
