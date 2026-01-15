'use client'

import { ExternalIcon } from '@status-im/icons/20'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { ButtonLink } from './button-link'
import { Divider } from './divider'

const Network = () => {
  const t = useTranslations()

  const SOLUTIONS = [
    {
      title: t('network.status.title'),
      description: t('network.status.description'),
      website: 'status.app',
      icon: '/logo-status.png',
    },
    {
      title: t('network.logos.title'),
      description: t('network.logos.description'),
      website: 'logos.co',
      icon: '/logo-logos.png',
    },
    {
      title: t('network.nimbus.title'),
      description: t('network.nimbus.description'),
      website: 'nimbus.team',
      icon: '/logo-nimbus.png',
    },
    {
      title: t('network.keycard.title'),
      description: t('network.keycard.description'),
      website: 'keycard.tech',
      icon: '/logo-keycard.png',
    },
  ]

  return (
    <section className="relative w-full" id="network">
      <div className="absolute left-0 top-0 z-10 h-full w-40 bg-gradient-to-r from-white-100 via-white-40 to-[transparent]" />
      <div className="absolute right-0 top-0 z-10 h-full w-40 bg-gradient-to-l from-white-100 via-white-40 to-[transparent]" />
      <div className="absolute left-0 top-0 z-10 h-40 w-full bg-gradient-to-b from-white-100 via-white-40 to-[transparent]" />
      <div className="absolute bottom-0 left-0 z-10 h-40 w-full bg-gradient-to-t from-white-100 via-white-40 to-[transparent]" />
      <div className="pointer-events-none absolute inset-0 bg-[url('/grid.svg')] bg-[size:16px_16px]" />
      <div className="relative z-20 px-5 py-24 lg:px-[120px] lg:py-[160px]">
        <div className="mb-20 text-center">
          <p className="mb-8 inline-block text-13 font-500 text-purple">
            {t('network.section_number')}{' '}
            <span className="inline-block h-2 w-px bg-purple-transparent" />{' '}
            {t('network.section_title')}
          </p>
          <h2 className="mb-5 text-40 font-600 lg:text-64">
            {t('network.title')}
          </h2>
          <p className="text-19 sm:text-27">{t('network.description')}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SOLUTIONS.map(solution => (
            <TechSolution key={solution.title} {...solution} />
          ))}
        </div>
      </div>
      <Divider />
    </section>
  )
}

export { Network }

type Props = {
  title: string
  description: string
  website: string
  icon: string
}

const TechSolution = (props: Props) => {
  const { title, description, website, icon } = props

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="relative size-12">
        <Image
          src={icon}
          alt={`${title} icon`}
          width={48}
          height={48}
          className="object-contain"
        />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-27 font-600">{title}</h3>
        <p className="max-w-[214px] text-19">{description}</p>
      </div>

      <ButtonLink
        variant="white"
        size="32"
        icon={<ExternalIcon className="text-neutral-50" />}
        href={`https://${website}`}
      >
        {website}
      </ButtonLink>
    </div>
  )
}
