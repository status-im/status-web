import { Button, Tag, Text } from '@status-im/components'
import { ExternalIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'
import { getTranslations } from 'next-intl/server'

import { KEYCARD_STORE_URL } from '~/config/routes'
import { jsonLD, JSONLDScript } from '~/utils/json-ld'
import { Metadata } from '~app/_metadata'
import { Image, Video } from '~components/assets'
import { Body } from '~components/body'
import { Link } from '~components/link'
import { ColorTheme } from '~website/_components/color-theme'
import { FeatureList } from '~website/_components/feature-list'
import { FeatureTag } from '~website/_components/feature-tag'
import { ParallaxCircle } from '~website/_components/parallax-circle'
import { Section } from '~website/_components/section'
import { VideoSection } from '~website/_components/video-section'

import { HeroSection } from '../_components/hero-section'

import type { ImageAlt } from '~components/assets'
import type { FeatureListProps } from '~website/_components/feature-list'
import type { Metadata as NextMetadata } from 'next'

export async function generateMetadata(): Promise<NextMetadata> {
  const t = await getTranslations('keycard')

  return Metadata({
    title: t('getKeycard'),
    description: t('description'),
    alternates: {
      canonical: '/keycard',
    },
  })
}

export default async function KeycardPage() {
  const t = await getTranslations('keycard')

  const organizationSchema = jsonLD.organization({
    description: t('description'),
  })

  const featureList: FeatureListProps['list'] = [
    {
      title: t('keysSecuredTitle'),
      description: t('keysSecuredDescription'),
      icon: 'Keycard/Icons/Icon Section/01_Keys_Secured:144:144',
    },
    {
      title: t('mobileFriendlyTitle'),
      description: t('mobileFriendlyDescription'),
      icon: 'Keycard/Icons/Icon Section/02_Mobile_Friendly:145:144',
    },
    {
      title: t('portableTitle'),
      description: t('portableDescription'),
      icon: 'Keycard/Icons/Icon Section/06_Portable_Discrete:145:144',
    },
    {
      title: t('noChargingTitle'),
      description: t('noChargingDescription'),
      icon: 'Keycard/Icons/Icon Section/04_No_Charging:144:144',
    },
    {
      title: t('openSourceTitle'),
      description: t('openSourceDescription'),
      icon: 'Keycard/Icons/Icon Section/05_Open_Source:145:144',
    },
    {
      title: t('unparalleledSecurityTitle'),
      description: t('unparalleledSecurityDescription'),
      icon: 'Keycard/Icons/Icon Section/03_Unparalleled_Security:145:144',
    },
  ]

  const prefooterList = [
    {
      title: t('openStandardsTitle'),
      description: t('openStandardsDescription'),
      links: [
        {
          label: 'bip-32',
          href: 'https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki',
        },
        {
          label: 'bip-39',
          href: 'https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki',
        },
        {
          label: 'bip-44',
          href: 'https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki',
        },
      ],
    },
    {
      title: t('easyIntegrationTitle'),
      description: t('easyIntegrationDescription'),
      links: [
        {
          label: t('documentation'),
          href: 'https://keycard.tech/docs/overview',
        },
      ],
    },
    {
      title: t('fullCustomizationTitle'),
      description: t('fullCustomizationDescription'),
      links: [
        {
          label: 'get@keycard.tech',
          href: 'mailto:get@keycard.tech',
        },
      ],
    },
  ] as const

  return (
    <>
      <JSONLDScript schema={organizationSchema} />
      <ColorTheme theme="army">
        <Body data-customisation="army">
          <div className="relative">
            <HeroSection
              title={t('title')}
              description={t('description')}
              reverse
              tag={<FeatureTag type="keycard" />}
              video={{
                id: 'Keycard/Animations/Keycard_Hero:1464:1400',
                posterId:
                  'Keycard/Animations/Frames/Keycard_Hero_Frame:1464:1400',
              }}
              action={
                <div className="inline-flex gap-2 rounded-20 border border-dashed border-neutral-80/20 p-2">
                  <Button iconAfter={<ExternalIcon />} href={KEYCARD_STORE_URL}>
                    {t('getKeycard')}
                  </Button>
                </div>
              }
              circle={
                <div className="left-[-358px] top-[-274px] z-10 block xl:hidden">
                  <ParallaxCircle />
                </div>
              }
              className="xl:pb-40"
            />
          </div>

          <div className="relative z-30 bg-white-100">
            <div className="container relative z-20 pb-7 pt-12 xl:py-20">
              <h2 className="text-40 font-bold xl:text-64">{t('tagline')}</h2>
            </div>
            <FeatureList list={featureList} />
            <ParallaxCircle className="top-[416px] xl:right-[80px] xl:top-[36px]" />
          </div>

          <div className="border-dashed-default relative z-20 border-b bg-white-100">
            <div className="container-lg w-[calc(100%+60px)] pb-10 xl:size-auto xl:pb-30 xl:pl-24">
              <Video
                id="Keycard/Animations/Keycard_02:1408:813"
                posterId="Keycard/Animations/Frames/Keycard_02_Frame:1408:813"
                className="ml-[-40px] h-[482px] bg-left object-cover object-left sm:h-[520px] xl:ml-0 xl:h-auto xl:bg-center xl:object-contain"
              />
            </div>
          </div>

          <div className="relative">
            <VideoSection
              title={t('integrationTitle')}
              circle={
                <div className="absolute top-[-438px] z-10 xl:left-[-80px]">
                  <ParallaxCircle />
                </div>
              }
              description={t('integrationDescription')}
              secondarySlot={
                <p className="-mt-8 text-15 text-neutral-50">
                  {t('integrationNote')}
                </p>
              }
              video={
                <Video
                  id="Keycard/Animations/Keycard_03:921:719"
                  posterId="Keycard/Animations/Frames/Keycard_03_Frame:921:719"
                  className={cx([
                    'relative',
                    'max-h-max max-w-[470px] sm:max-w-full md:max-h-[591px] lg:!max-h-[620px]',
                    '-top-0 right-4 sm:-right-20 md:-right-10 md:top-0 lg:-top-10 xl:-right-20 2xl:-right-10 2xl:top-16',
                  ])}
                />
              }
            />

            <Section
              icon="Keycard/Icons/Screen Section/01_Protect_Your_Assets:144:144"
              title={t('protectAssetsTitle')}
              description={t('protectAssetsDescription')}
              secondary={[
                {
                  title: t('intrinsicallySecureTitle'),
                  description: t('intrinsicallySecureDescription'),
                },
              ]}
              image={{
                id: 'Keycard/Screens/Keycard_01:750:1624',
                alt: t(
                  'protectAssetsAlt'
                ) as ImageAlt['Keycard/Screens/Keycard_01:750:1624'],
              }}
            />

            <Section
              reverse
              icon="Keycard/Icons/Screen Section/02_Protect_Your_Identity:144:144"
              title={t('protectIdentityTitle')}
              description={t('protectIdentityDescription')}
              secondary={[
                {
                  title: t('encryptedTitle'),
                  description: t('encryptedDescription'),
                },
                {
                  title: t('migrateTitle'),
                  description: t('migrateDescription'),
                },
                {
                  title: t('profileSecuredTitle'),
                  description: t('profileSecuredDescription'),
                },
              ]}
              image={{
                id: 'Keycard/Screens/Keycard_02:750:1624',
                alt: t(
                  'protectIdentityAlt'
                ) as ImageAlt['Keycard/Screens/Keycard_02:750:1624'],
              }}
            />
            <div className="mask-image absolute left-1/2 top-0 h-[calc(100%+80px)] w-screen -translate-x-1/2 bg-[url('/texture-gradient.png')] bg-[length:420px]" />
            <div className="absolute left-1/2 top-0 z-[2] h-[calc(100%+80px)] w-screen -translate-x-1/2 bg-gradient-to-t from-customisation-army-50/10 to-transparent" />
          </div>

          <div className="relative mt-20 border-t border-dashed border-neutral-30 bg-white-100">
            <div className="relative mx-auto max-w-[1264px]">
              <div className="grid grid-cols-1 justify-center divide-y divide-dashed divide-neutral-30 xl:grid-cols-3 xl:divide-x xl:divide-y-0 xl:py-0">
                {prefooterList.map(({ title, description, links }) => (
                  <div
                    key={title}
                    className="relative px-5 py-12 xl:px-10 xl:py-40"
                  >
                    <div
                      role="presentation"
                      className="absolute inset-y-0 -left-px hidden h-full w-px bg-gradient-to-t from-white-100 xl:block"
                    />
                    <div className="mb-6 gap-1">
                      <h3>
                        <Text size={27} weight="semibold">
                          {title}
                        </Text>
                      </h3>
                      <Text size={19}>{description}</Text>
                    </div>
                    <div className="flex gap-2">
                      {links.map(link => (
                        <Link key={link.label} href={link.href}>
                          <Tag label={link.label} />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <Image
                id="Keycard/Stickers/01:410:409"
                alt=""
                width={130}
                height={130}
                className="absolute -right-8 top-1/2 xl:-top-14 xl:left-[464px]"
              />
              <Image
                id="Keycard/Stickers/02:441:442"
                alt=""
                width={136}
                height={136}
                className="absolute -bottom-10 right-24 xl:-right-6 xl:top-8"
              />
              <Image
                id="Keycard/Stickers/03:441:442"
                alt=""
                width={130}
                height={130}
                className="absolute -top-12 right-8 xl:-left-14 xl:bottom-0 xl:top-auto"
              />
            </div>
          </div>

          <div className="container flex flex-col items-center border-t border-dashed border-neutral-30 py-24 text-center xl:border-none xl:pb-40 xl:pt-0">
            <h4 className="mb-4 text-40 font-bold xl:text-64">
              {t('getKeycard')}
            </h4>
            <p className="mb-8 max-w-[572px] text-27 font-regular">
              {t('safestWallet')}
            </p>
            <Button iconAfter={<ExternalIcon />} href={KEYCARD_STORE_URL}>
              {t('getKeycard')}
            </Button>
          </div>
        </Body>
      </ColorTheme>
    </>
  )
}
