'use client'

import { ExternalIcon } from '@status-im/icons/20'
import { TwitterIcon } from '@status-im/icons/social'
import {
  CATS_FISHING_URL,
  DIN_URL,
  GATEWAY_URL,
  LINEA_URL,
  PONZI_HERO_URL,
  SPLA_LABS_URL,
} from '~/config/routes'
import { cx } from 'cva'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { ButtonLink } from './button-link'
import { Divider } from './divider'

const Partners = () => {
  const t = useTranslations()

  return (
    <section className="w-full" id="partners">
      <div className="p-2">
        <div className="rounded-24 bg-gradient-to-b from-[transparent] to-neutral-80/5 p-2 pt-[104px] lg:px-[112px] lg:py-40">
          <div className="mb-16">
            <p className="mb-6 inline-block text-13 font-500 text-purple">
              {t('partners.section_number.translation')}{' '}
              <span className="inline-block h-2 w-px bg-purple-transparent" />{' '}
              {t('partners.section_title.translation')}
            </p>
            <h2 className="text-40 font-600 lg:text-64">
              {t('partners.title.translation')}
            </h2>
          </div>

          <div className="mb-24 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <GameCard
              title={t('partners.cats_fishing.title.translation')}
              description={t('partners.cats_fishing.description.translation')}
              image="/cats-fishing-cover.png"
              website={CATS_FISHING_URL}
              twitter="catsfishings"
              icon="/cats-fishing-avatar.png"
            />
            <GameCard
              title={t('partners.spla_labs.title.translation')}
              description={t('partners.spla_labs.description.translation')}
              image="/spla-labs-cover.png"
              website={SPLA_LABS_URL}
              twitter="splalabs"
              icon="/spla-labs-avatar.png"
            />
            <GameCard
              title={t('partners.ponzi_hero.title.translation')}
              description={t('partners.ponzi_hero.description.translation')}
              image="/ponzi-hero-cover.png"
              website={PONZI_HERO_URL}
              twitter="Splalabs"
              icon="/ponzi-hero-avatar.png"
            />
          </div>

          <div className="space-y-8">
            <h2 className="text-40 font-600">
              {t('partners.subtitle.translation')}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <PartnerCard
                title={t('partners.linea.title.translation')}
                description={t('partners.linea.description.translation')}
                logo="/linea.png"
                website={LINEA_URL}
              />
              <PartnerCard
                title={t('partners.gateway.title.translation')}
                description={t('partners.gateway.description.translation')}
                logo="/gateway.png"
                website={GATEWAY_URL}
              />
              <PartnerCard
                title={t('partners.din.title.translation')}
                description={t('partners.din.description.translation')}
                logo="/din.png"
                website={DIN_URL}
              />
            </div>
          </div>
        </div>
      </div>
      <Divider />
    </section>
  )
}

export { Partners }

type CardProps = {
  children: React.ReactNode
  className?: string
}

const Card = (props: CardProps) => {
  const { children, className } = props

  return (
    <div
      className={cx([
        'rounded-32 border border-neutral-10 bg-white-100 shadow-1 transition-all hover:scale-[101%] hover:shadow-2 lg:rounded-20',
        className,
      ])}
    >
      {children}
    </div>
  )
}

const CardHeader = (props: CardProps) => {
  const { children, className } = props

  return (
    <div
      className={cx(['overflow-hidden rounded-24 lg:rounded-t-16', className])}
    >
      {children}
    </div>
  )
}

const CardContent = (props: CardProps) => {
  const { children, className } = props

  return <div className={className}>{children}</div>
}

type GameCardProps = {
  title: string
  description: string
  image: string
  website: string
  twitter: string
  icon?: string
}

const GameCard = (props: GameCardProps) => {
  const { title, description, image, website, twitter, icon } = props

  return (
    <Card className="flex flex-col overflow-hidden rounded-28 p-2">
      <CardHeader className="relative h-[110px] flex-shrink-0 rounded-20 lg:h-[137px]">
        <Image src={image} alt={title} fill className="object-cover" />
      </CardHeader>
      <CardContent className="relative z-10 flex flex-grow flex-col gap-4 p-4">
        <div className="-mt-20 flex flex-col items-start gap-3">
          {icon && (
            <Image
              src={icon}
              alt={`${title} icon`}
              width={80}
              height={80}
              quality={100}
              className="size-20 rounded-16 object-cover"
            />
          )}
          <div>
            <h3 className="text-19 font-600">{title}</h3>
            <p className="">{description}</p>
          </div>
        </div>
        <div className="mt-auto flex items-center gap-3">
          <ButtonLink
            href={website}
            variant="white"
            size="32"
            icon={<ExternalIcon className="text-neutral-50" />}
          >
            <span>{website.replace('https://', '')}</span>
          </ButtonLink>
          <ButtonLink
            href={`https://x.com/${twitter}`}
            variant="white"
            size="32"
            className="w-8 px-[7px]"
          >
            <TwitterIcon className="size-4" />
          </ButtonLink>
        </div>
      </CardContent>
    </Card>
  )
}

type PartnerCardProps = {
  title: string
  description: string
  logo: string
  website: string
}

const PartnerCard = (props: PartnerCardProps) => {
  const { title, description, logo, website } = props

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-4 lg:gap-4 lg:p-6">
        <Image
          src={logo}
          alt={`${title} logo`}
          width={48}
          height={48}
          className="rounded-16"
        />
        <div className="flex flex-col gap-1">
          <h3 className="text-27 font-600">{title}</h3>
          <p className="text-19">{description}</p>
        </div>
        <ButtonLink
          variant="white"
          size="32"
          icon={<ExternalIcon className="text-neutral-50" />}
          href={website}
        >
          <span>{website.replace('https://', '')}</span>
        </ButtonLink>
      </CardContent>
    </Card>
  )
}
