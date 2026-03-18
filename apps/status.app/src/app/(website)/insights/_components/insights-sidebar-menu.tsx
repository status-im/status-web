import { useTranslations } from 'next-intl'

import { SidebarMenu } from '~website/_components/sidebar-menu'
import { useGetEpicMenuLinksQuery } from '~website/insights/_graphql/generated/hooks'

import { getEpicDisplayName } from '../_utils'

const STATIC_LINKS = [
  {
    labelKey: 'orphans',
    href: '/insights/orphans',
  },
  {
    labelKey: 'repos',
    href: '/insights/repos',
  },
]

export const InsightsSidebarMenu = () => {
  const t = useTranslations('insights')
  const { data, isLoading } = useGetEpicMenuLinksQuery({})

  const linksFromQuery =
    data?.gh_epics
      .filter(epic => epic.status === 'In Progress')
      .map(epic => epic.epic_name) || []

  const epicLinks =
    linksFromQuery?.map(epicName => {
      return {
        label: getEpicDisplayName(epicName as string | undefined),
        // todo: support as object
        href: `/insights/epics/${epicName}`,
      }
    }) || []

  return (
    <SidebarMenu
      items={[
        {
          label: t('epics'),
          href: '/insights/epics',
          links: [
            {
              label: t('epics'),
              href: '/insights/epics',
            },
            ...epicLinks,
          ],
        },
        ...STATIC_LINKS.map(link => ({
          label: t(link.labelKey),
          href: link.href,
        })),
      ]}
      isLoading={isLoading}
    />
  )
}
