import { Button, Tag, Text } from '@status-im/components'
import { ArrowRightIcon, ExternalIcon } from '@status-im/icons/20'
import { getTranslations } from 'next-intl/server'

import { jsonLD, JSONLDScript } from '~/utils/json-ld'
import { Metadata } from '~app/_metadata'
import { Image } from '~components/assets'
import { Body } from '~components/body'
import { Link } from '~components/link'
import { ParallaxCircle } from '~website/_components/parallax-circle'

import { CircleWord } from '../_components/circle-word'
import { OrgChart } from './_components/org-chart'

import type { ImageType } from '~components/assets'

export const metadata = Metadata({
  title: 'Team',
  description:
    'Founded in 2017, Status has grown to over 90 core contributors. Meet the team behind the open-source, decentralised wallet and messenger.',
  alternates: {
    canonical: '/team',
  },
})

export default async function TeamPage() {
  const t = await getTranslations('team')
  const tn = await getTranslations('nav')

  const organizationSchema = jsonLD.organization({
    description:
      'Founded in 2017, Status has grown to over 90 core contributors building the open-source, decentralised wallet and messenger.',
  })

  const ABOUT_LIST = [
    {
      title: t('whoAreWe'),
      description: t('whoAreWeText'),
      cta: {
        label: t('buildFreeWorld'),
        href: '/jobs',
      },
    },
    {
      title: t('whyStatus'),
      description: t('whyStatusText'),
      cta: {
        label: t('viewManifesto'),
        href: '/manifesto',
      },
    },
    {
      title: t('whereAreWe'),
      description: t('whereAreWeText'),
      cta: {
        label: t('privacyRevolution'),
        href: '/jobs',
      },
    },
  ] satisfies Array<{
    title: string
    description: string
    cta: {
      label: string
      href: string
    }
  }>

  const NETWORK_LIST = [
    {
      image: { id: 'Team/Network Section/Logos:96:96', alt: 'Logos logo' },
      title: t('logos'),
      description: t('logosDescription'),
      url: 'https://logos.co',
    },
    {
      image: { id: 'Team/Network Section/Vac:96:96', alt: 'Vac logo' },
      title: t('vac'),
      description: t('vacDescription'),
      url: 'https://vac.dev',
    },
  ] satisfies Array<{
    image: ImageType
    title: string
    description: string
    url: string
  }>

  return (
    <>
      <JSONLDScript schema={organizationSchema} />
      <Body>
        <div className="container mb-11 max-w-[742px] pt-24 xl:mb-20 xl:pt-40">
          <div className="mb-4 flex">
            <Tag size="32" label={tn('team')} />
          </div>
          <h1 className="text-27 font-regular xl:text-40">
            {t('heroDescription')}{' '}
            <CircleWord
              imageId="Team/Scribbles and Notes/Scribble_01:478:169"
              className="!top-[-4%]"
            >
              <span className="whitespace-nowrap">{t('heroOver90')}</span>
            </CircleWord>{' '}
            {t('heroCoreContributors')}{' '}
            <CircleWord imageId="Team/Scribbles and Notes/Scribble_02:772:196">
              {t('heroHumanRights')}
            </CircleWord>
          </h1>
        </div>

        <div className="relative mb-24">
          <ParallaxCircle color="purple" className="left-0 top-[-80px]" />
          <ParallaxCircle color="sky" className="right-0 top-[200px]" />
          <ParallaxCircle color="orange" className="left-[220px] top-[200px]" />
          <ParallaxCircle
            color="sky"
            className="right-[100px] top-[560px] xl:top-0"
          />

          <div className="relative z-20 mx-auto max-w-[1512px]">
            <div className="-mx-72 xl:-mx-40">
              <Image
                id="Team/Photos/Team_01:6400:2501"
                alt="Status team photo showing core contributors"
                priority
              />
            </div>
          </div>
        </div>

        <div className="container relative grid grid-cols-1 gap-12 pb-24 xl:grid-cols-3 xl:gap-14 xl:pb-40">
          {ABOUT_LIST.map(item => (
            <div key={item.title} className="relative z-20">
              <h3 className="mb-2 text-19 font-600">{item.title}</h3>
              <Text size={19}>{item.description}</Text>
              <Link
                href={item.cta.href}
                className="mt-3 flex items-center gap-1 text-19 font-medium transition-colors hover:text-neutral-50"
              >
                {item.cta.label}
                <ArrowRightIcon />
              </Link>
            </div>
          ))}
          <ParallaxCircle color="orange" className="bottom-[-320px] right-0" />
        </div>
        <div className="border-dashed-default relative overflow-hidden border-b bg-white-100">
          <ParallaxCircle
            color="purple"
            className="left-0 top-[-80px] z-10 hidden sm:block"
          />
          <ParallaxCircle
            color="army"
            className="-bottom-1/2 right-40 z-10 hidden sm:block"
          />
          <div className="border-dashed-default relative z-20 border-t pt-24 xl:pt-40">
            <h2 className="text-center text-40 font-bold xl:text-64">
              {t('contributorCount')}
            </h2>
          </div>
          <div className="relative z-20 flex justify-center pb-24 pt-14 2md:pb-40 2md:pt-20">
            <OrgChart />
          </div>
        </div>

        <div className="container py-24 lg:py-40">
          <div className="mb-16 lg:mb-20">
            <h2 className="text-40 font-bold xl:text-64">{t('ourNetwork')}</h2>
          </div>

          <div className="grid gap-3 md:gap-4 2md:grid-cols-2 lg:grid-cols-3 xl:gap-5">
            {NETWORK_LIST.map(item => (
              <div
                key={item.title}
                className="flex cursor-default flex-col rounded-20 border border-neutral-20 p-4 shadow-1 transition-shadow hover:shadow-3"
              >
                <div className="flex-1">
                  <div className="mb-3">
                    <Image {...item.image} width={48} height={48} />
                  </div>
                  <h3 className="mb-1 text-19 font-600">{item.title}</h3>
                  <p className="mb-5 text-15">{item.description}</p>
                </div>
                <div className="shrink-0">
                  <Button
                    variant="outline"
                    href={item.url}
                    size="32"
                    iconAfter={<ExternalIcon />}
                  >
                    {item.url.replace('https://', '')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Body>
    </>
  )
}
