import { BulletIcon } from '@status-im/icons/20'
import { getTranslations } from 'next-intl/server'

import { jsonLD, JSONLDScript } from '~/utils/json-ld'
import { Metadata } from '~app/_metadata'
import { formatDate } from '~app/_utils/format-date'
import { Body } from '~components/body'

import type { Metadata as NextMetadata } from 'next'

export async function generateMetadata(): Promise<NextMetadata> {
  const t = await getTranslations('snt')

  return Metadata({
    title: t('releaseScheduleMetaTitle'),
    description: t('releaseScheduleMetaDescription'),
    alternates: {
      canonical: '/snt/release-schedule',
    },
  })
}

export default async function ReleaseSchedule() {
  const t = await getTranslations('snt')
  const organizationSchema = jsonLD.organization({
    description: t('releaseScheduleMetaDescription'),
  })

  return (
    <>
      <JSONLDScript schema={organizationSchema} />
      <Body className="pb-24 pt-16 xl:pb-40 xl:pt-32">
        <div className="container max-w-[calc(702px+20px*2)]">
          <div className="mb-12">
            <h1 className="mb-3 text-40 font-bold xl:text-64">
              {t('releaseScheduleTitle')}
            </h1>
            <p className="text-19 text-neutral-50">
              {t('lastUpdate')} {formatDate('2024-07-16', 'long')}
            </p>
          </div>

          <div className="flex flex-col gap-6 py-6">
            <p className="text-19">{t('releaseScheduleIntro')}</p>
            <ul className="flex flex-col gap-3 text-19">
              <li className="flex items-start gap-2">
                <div className="mt-1.5 flex shrink-0 items-center">
                  <BulletIcon className="text-neutral-50" />
                </div>
                <p>
                  2,999,015,278 were allocated to the{' '}
                  <span className="font-semibold">
                    {t('publicContributors')}
                  </span>{' '}
                  {t('publicContributorsDetail')}
                </p>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1.5 flex shrink-0 items-center">
                  <BulletIcon className="text-neutral-50" />
                </div>
                <p>
                  471,505,389 were allocated to{' '}
                  <span className="font-semibold">{t('genesisToken')}</span>{' '}
                  {t('genesisTokenDetail')}
                </p>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1.5 flex shrink-0 items-center">
                  <BulletIcon className="text-neutral-50" />
                </div>
                <p>
                  1,360,937,157 were allocated to{' '}
                  <span className="font-semibold">{t('coreDevelopers')}</span>;{' '}
                  {t('coreDevelopersDetail')}
                </p>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1.5 flex shrink-0 items-center">
                  <BulletIcon className="text-neutral-50" />
                </div>
                <p>
                  1,973,412,351 were allocated to the{' '}
                  <span className="font-semibold">{t('communityReserve')}</span>
                  ; {t('communityReserveDetail')}
                </p>
              </li>
            </ul>
          </div>

          <div className="pb-6">
            <p className="text-19">{t('releaseNote1')}</p>
          </div>
          <p className="text-19">{t('releaseNote2')}</p>
        </div>
      </Body>
    </>
  )
}
