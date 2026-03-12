import { getTranslations } from 'next-intl/server'

import { DISCUSS_URL, MESSARI_URL } from '~/config/routes'
import { jsonLD, JSONLDScript } from '~/utils/json-ld'
import { Metadata } from '~app/_metadata'
import { Body } from '~components/body'
import { FeatureList } from '~website/_components/feature-list'
import { ParallaxCircle } from '~website/_components/parallax-circle'

import { HeroSection } from '../_components/hero-section'

import type { Metadata as NextMetadata } from 'next'

export async function generateMetadata(): Promise<NextMetadata> {
  const t = await getTranslations('snt')

  return Metadata({
    title: t('metaTitle'),
    description: t('description'),
    alternates: {
      canonical: '/snt',
    },
  })
}

export default async function TokenPage() {
  const t = await getTranslations('snt')
  const organizationSchema = jsonLD.organization({
    description: t('description'),
  })

  return (
    <>
      <JSONLDScript schema={organizationSchema} />
      <Body>
        <div className="relative">
          <div className="relative z-30">
            <ParallaxCircle
              color="blue"
              className="right-6 top-[-266px] xl:right-0"
            />
          </div>
          <div className="relative z-10">
            <HeroSection
              tag={t('metaTitle')}
              title={t('title')}
              description={t('description')}
              video={{
                id: 'Token/Animations/Token_Hero:721:575',
                posterId: 'Token/Animations/Frames/Token_Hero_Frame:721:575',
              }}
            />
          </div>
        </div>

        <section className="container-lg relative py-12 xl:py-30">
          <ParallaxCircle color="blue" className="left-5 top-[282px]" />
          <div className="relative mx-auto max-w-[742px]">
            <h3 className="text-27 font-regular xl:text-40">
              {t('tokenDescription')}
            </h3>
          </div>
        </section>

        <section className="pb-24 pt-12 xl:pb-40 xl:pt-20">
          <FeatureList
            list={[
              {
                title: t('voteTitle'),
                description: t('voteDescription'),
                icon: 'Token/Icons/Icon Section/01_Vote_for_Communities:144:144',
              },
              {
                title: t('prioritiseTitle'),
                description: t('prioritiseDescription'),
                icon: 'Token/Icons/Icon Section/02_Help_Prioritize_Features:145:144',
              },
              {
                title: t('ensTitle'),
                description: t('ensDescription'),
                icon: 'Token/Icons/Icon Section/03_Create_ENS_Name:145:144',
              },
              {
                title: t('trustedTitle'),
                description: t('trustedDescription'),
                icon: 'Token/Icons/Icon Section/04_A_Trusted_Token:144:144',
                link: {
                  label: t('messariTitle'),
                  href: MESSARI_URL,
                },
              },
              {
                title: t('researchTitle'),
                description: t('researchDescription'),
                icon: 'Token/Icons/Icon Section/05_Research:145:144',
                link: {
                  label: t('joinDiscussion'),
                  href: DISCUSS_URL,
                },
              },
              {
                title: t('alwaysImproving'),
                description: t('alwaysImprovingDescription'),
                icon: 'Token/Icons/Icon Section/06_Always_Improving:145:144',
                link: {
                  label: t('visitBlog'),
                  href: '/blog',
                },
              },
            ]}
          />
        </section>
      </Body>
    </>
  )
}
