import { Avatar } from '@status-im/components'
import { match } from 'ts-pattern'

import { AdminLayoutDetailView } from '~admin/_layouts/admin-layout-detail-view'

import { InsightsAppIcon } from '../../../_components/insights-app-icon'
import { MilestonesStatusGroupList } from '../../../_components/milestones-status-group-list'

import type { CustomisationColorType } from '@status-im/components'
import type { AdminLayoutDetailViewProps } from '~admin/_layouts/admin-layout-detail-view'
import type { ApiOutput } from '~server/api/types'

type Props = {
  project: ApiOutput['projects']['byId']
  breadcrumbs: AdminLayoutDetailViewProps['breadcrumbs']
}

const ViewProject = (props: Props) => {
  const { project, breadcrumbs } = props

  return (
    <AdminLayoutDetailView
      title={project.name}
      description={project.description}
      breadcrumbs={breadcrumbs}
      avatar={
        <div
          className="contents"
          data-customisation={match<
            Props['project']['app'],
            CustomisationColorType
          >(project.app)
            .with('shell', () => 'blue')
            .with('communities', () => 'turquoise')
            .with('messenger', () => 'purple')
            .with('wallet', () => 'yellow')
            .with('browser', () => 'magenta')
            .with('node', () => 'copper')
            .exhaustive()}
        >
          <Avatar
            type="icon"
            size="32"
            icon={<InsightsAppIcon type={project.app} />}
          />
        </div>
      }
    >
      <MilestonesStatusGroupList
        milestones={project.milestones}
        cardFooterType="epics"
      />
    </AdminLayoutDetailView>
  )
}

export { ViewProject }
