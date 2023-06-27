import { Breadcrumbs } from '@/components/breadcrumbs'
import { EpicOverview } from '@/components/epic-overview'
import { TableIssues } from '@/components/table-issues'
import { InsightsLayout } from '@/layouts/insights-layout'

import { epics } from '.'

import type { BreadcrumbsProps } from '@/components/breadcrumbs'
import type { GetStaticPaths, GetStaticProps, Page } from 'next'

type Params = { epic: string }

type Epic = (typeof epics)[number]

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const paths = epics.map(epic => ({
    params: { epic: epic.id },
  }))

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<Props, Params> = async context => {
  const epic = epics.find(epic => epic.id === context.params!.epic)!

  if (!epic) {
    return {
      // notFound: true,
      redirect: { destination: '/insights/epics', permanent: false },
    }
  }

  return {
    props: {
      epic,
      breadcrumbs: [
        {
          label: 'Epics',
          href: '/insights/epics',
        },
        {
          label: epic.title,
          href: `/insights/epics/${epic.id}`,
        },
      ],
    },
  }
}

type Props = {
  epic: Epic
  breadcrumbs: BreadcrumbsProps['items']
}

const EpicsDetailPage: Page<Props> = props => {
  const { epic, breadcrumbs } = props

  return (
    <div>
      <Breadcrumbs items={breadcrumbs} />

      <div className="px-10 py-6">
        <EpicOverview
          title={epic.title}
          description={epic.description}
          fullscreen
        />
      </div>
      <div className="border-b border-neutral-10 px-10 py-6">
        <div role="separator" className="-mx-6 my-6 h-px bg-neutral-10" />

        <TableIssues />
      </div>
    </div>
  )
}

EpicsDetailPage.getLayout = function getLayout(page) {
  return <InsightsLayout>{page}</InsightsLayout>
}

export default EpicsDetailPage
