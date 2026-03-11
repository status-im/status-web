import { getTranslations } from 'next-intl/server'

import { jsonLD, JSONLDScript } from '~/utils/json-ld'
import { Metadata } from '~app/_metadata'
import { formatDate } from '~app/_utils/format-date'
import { Body } from '~components/body'
import { Link } from '~components/link'

export const metadata = Metadata({
  title: 'Security',
  description:
    'Status takes security seriously. Please report any security incidents via security@status.im.',
  alternates: {
    canonical: '/security',
  },
})

export default async function SecurityPage() {
  const t = await getTranslations('security')

  const organizationSchema = jsonLD.organization({
    description:
      'Status takes security seriously. Please report any security incidents via security@status.im.',
  })

  return (
    <>
      <JSONLDScript schema={organizationSchema} />
      <Body className="pb-24 pt-16 xl:pb-40 xl:pt-32">
        <div className="container max-w-[742px]">
          <div className="mb-12">
            <h1 className="mb-3 text-40 font-bold xl:text-64">{t('title')}</h1>
            <p className="text-19 text-neutral-50">
              Last update: {formatDate('2024-05-15', 'long')}
            </p>
          </div>

          <div className="py-6">
            <p className="text-19">{t('description')}</p>
            <p className="text-19">
              {t('reportIncidents')}{' '}
              <Link
                href="mailto:security@status.im"
                className="text-customisation-blue-50 hover:text-customisation-blue-60"
              >
                security@status.im
              </Link>
              .
            </p>
          </div>

          <div className="py-6">
            <p className="text-19">
              {t('reportVulnerabilities')}{' '}
              <Link
                href="https://hackenproof.com/ift/status"
                className="text-customisation-blue-50 hover:text-customisation-blue-60"
              >
                {t('hackenProof')}
              </Link>{' '}
              {t('ensureSecure')}
            </p>
          </div>
        </div>
      </Body>
    </>
  )
}
