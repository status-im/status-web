import { Text } from '@status-im/components'
import { getTranslations } from 'next-intl/server'

import { jsonLD, JSONLDScript } from '~/utils/json-ld'
import { Metadata } from '~app/_metadata'
import { Body } from '~components/body'
import { HeroSection } from '~website/_components/hero-section'
import { ParallaxCircle } from '~website/_components/parallax-circle'

import { DiscussCTA } from './_components/discuss-cta'
import { WordAnimation } from './_components/word-animation'

import type { Metadata as NextMetadata } from 'next'

export async function generateMetadata(): Promise<NextMetadata> {
  const t = await getTranslations('translations')

  return Metadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: '/translations',
    },
  })
}

export default async function TranslationsPage() {
  const t = await getTranslations('translations')

  const organizationSchema = jsonLD.organization({
    description: t('metaDescription'),
  })

  return (
    <>
      <JSONLDScript schema={organizationSchema} />
      <Body>
        <HeroSection
          tag={t('tag')}
          title={t('title')}
          description={t('description')}
          action={<DiscussCTA />}
          video={{
            id: 'Translations/Animations/Translations_Hero:721:575',
            posterId:
              'Translations/Animations/Frames/Translations_Hero_Frame:721:575',
          }}
        />
        <ParallaxCircle
          color="blue"
          className="left-[-310px] right-auto top-[-310px] xl:left-auto xl:right-6 xl:top-[-343px]"
        />
        <ParallaxCircle
          color="purple"
          className="left-[-254px] top-[236px] xl:left-[40px] xl:top-[336px]"
        />
        <ParallaxCircle
          color="sky"
          className="left-[-488px] top-[236px] xl:left-[344px] xl:top-[336px]"
        />
        <ParallaxCircle
          color="orange"
          className="right-0 top-[836px] xl:right-[444px] xl:top-[636px]"
        />
        <ParallaxCircle
          color="sky"
          className="right-[-320px] top-[836px] xl:right-[44px] xl:top-[636px]"
        />
        <ParallaxCircle
          color="blue"
          className="bottom-[262px] left-[-338px] right-auto xl:left-auto xl:right-[calc(50%+76px)]"
        />

        <section className="relative z-20 cursor-default select-none py-12 text-center xl:py-20">
          <WordAnimation />
        </section>

        <section className="container relative z-20 max-w-[742px] pb-24 pt-20 xl:pb-40">
          <h3 className="mb-3 text-27 font-semibold xl:mb-4">
            {t('missionTitle')}
          </h3>
          <p className="mb-12">
            <Text size={19}>{t('missionText')}</Text>
          </p>

          <h3 className="mb-3 text-27 font-semibold xl:mb-4">
            {t('reachOutTitle')}
          </h3>
          <p>
            <Text size={19}>{t('reachOutText')}</Text>
          </p>
        </section>

        <div className="border-dashed-default relative z-20 flex flex-col items-center border-t bg-white-100 px-5 py-24 text-center xl:py-40">
          <h4 className="mb-4 text-40 font-bold xl:text-64">
            {t('startTranslating')}
          </h4>
          <p className="mb-6 max-w-[574px] text-27">{t('contributeText')}</p>
          <div className="flex gap-3">
            <DiscussCTA />
          </div>
        </div>
      </Body>
    </>
  )
}
