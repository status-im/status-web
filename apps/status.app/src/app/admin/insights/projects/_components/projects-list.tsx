'use client'

import { useMemo, useOptimistic, useState, useTransition } from 'react'

import { arrayMove } from '@dnd-kit/sortable'
import * as colors from '@status-im/colors'
import { matchSorter } from 'match-sorter'
import { usePathname, useRouter } from 'next/navigation'
import { match } from 'ts-pattern'

import { AddNewButton } from '~admin/_components/add-new-button'
import { FilterTag } from '~admin/_components/filter-tag'
import { MultiselectFilter } from '~admin/_components/multiselect-filter'
import { SearchInput } from '~admin/_components/search-input'
import { useLayoutContext } from '~admin/_contexts/layout-context'
import { useUserContext } from '~admin/_contexts/user-context'
import { AdminLayoutList } from '~admin/_layouts/admin-layout-list'
import { projectSchema } from '~server/api/validation/projects'

import { InsightsAppIcon } from '../../_components/insights-app-icon'
import { InsightsStatusIcon } from '../../_components/insights-status-icon'
import { updateProjectPosition } from '../_actions'
import { TableSortable } from './table-sortable'

import type { MultiselectOption } from '~admin/_components/multiselect-filter'
import type { ApiOutput } from '~server/api/types'

const appType = projectSchema.shape.app

export const projectAppOptions = [
  {
    id: appType.Enum.shell,
    label: 'Shell',
    icon: <InsightsAppIcon type={appType.Enum.shell} />,
  },
  {
    id: appType.Enum.communities,
    label: 'Communities',
    icon: <InsightsAppIcon type={appType.Enum.communities} />,
  },
  {
    id: appType.Enum.messenger,
    label: 'Messenger',
    icon: <InsightsAppIcon type={appType.Enum.messenger} />,
  },
  {
    id: appType.Enum.wallet,
    label: 'Wallet',
    icon: <InsightsAppIcon type={appType.Enum.wallet} />,
  },
  {
    id: appType.Enum.browser,
    label: 'Browser',
    icon: <InsightsAppIcon type={appType.Enum.browser} />,
  },
  {
    id: appType.Enum.node,
    label: 'Node',
    icon: <InsightsAppIcon type={appType.Enum.node} />,
  },
]

export const projectStatusOptions: MultiselectOption[] = [
  {
    id: 'not-started',
    label: 'Not started',
    icon: <InsightsStatusIcon status="not-started" />,
  },
  {
    id: 'in-progress',
    label: 'In progress',
    icon: <InsightsStatusIcon status="in-progress" />,
  },
  {
    id: 'done',
    label: 'Done',
    icon: <InsightsStatusIcon status="done" />,
  },
  {
    id: 'paused',
    label: 'Paused',
    icon: <InsightsStatusIcon status="paused" />,
  },
]

type Props = {
  projects: ApiOutput['projects']['all']
  isAdmin?: boolean
}

export const ProjectsList = (props: Props) => {
  const { projects, isAdmin } = props

  const router = useRouter()
  const pathname = usePathname()

  const user = useUserContext()

  const [optimisticProjects, setOptimisticProjects] = useOptimistic(projects)

  const [, startTransition] = useTransition()

  const [searchFilter, setSearchFilter] = useState<string>('')
  const [appFilter, setAppFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string[]>([])

  const { showRightView } = useLayoutContext()

  const clearFilter = () => {
    setSearchFilter('')
    setAppFilter([])
    setStatusFilter([])
  }

  const handleSort = async (from: number, to: number) => {
    startTransition(async () => {
      const project = projects.find(p => p.position === from)

      setOptimisticProjects(arrayMove(projects, from, to))
      await updateProjectPosition({ id: project!.id, to })
    })
  }

  const filteredProjects = useMemo(() => {
    let filtered = optimisticProjects

    if (searchFilter !== '') {
      filtered = matchSorter(filtered, searchFilter, { keys: ['name'] })
    }

    if (appFilter.length > 0) {
      filtered = filtered.filter(p => appFilter.includes(p.app))
    }

    if (statusFilter.length > 0) {
      filtered = filtered.filter(p => statusFilter.includes(p.status))
    }

    return filtered
  }, [optimisticProjects, searchFilter, appFilter, statusFilter])

  const hasActiveFilter =
    searchFilter !== '' || appFilter.length > 0 || statusFilter.length > 0

  return (
    <AdminLayoutList segment="projects">
      <div className="flex flex-col">
        <div className="flex flex-col gap-6">
          {user.canEditInsights && (
            <AddNewButton href="/admin/insights/projects/new">
              New project
            </AddNewButton>
          )}

          <AdminLayoutList.Filters>
            <SearchInput
              placeholder="Find projects"
              value={searchFilter}
              onChange={setSearchFilter}
            />
            <MultiselectFilter
              label="App"
              options={projectAppOptions}
              selection={appFilter}
              onSelectionChange={setAppFilter}
            />
            <MultiselectFilter
              label="Status"
              options={projectStatusOptions}
              selection={statusFilter}
              onSelectionChange={setStatusFilter}
            />
          </AdminLayoutList.Filters>
        </div>
        {(statusFilter.length > 0 || appFilter.length > 0) && (
          <FilterTag.Group>
            {statusFilter.map(status => {
              return (
                <FilterTag.Item
                  key={status}
                  title="Status"
                  label={
                    projectStatusOptions.find(p => p.id === status)?.label || ''
                  }
                  onRemove={() => {
                    setStatusFilter(statusFilter.filter(f => f !== status))
                  }}
                />
              )
            })}
            {appFilter.map(app => {
              return (
                <FilterTag.Item
                  key={app}
                  title="App"
                  label={app}
                  onRemove={() => {
                    setAppFilter(appFilter.filter(f => f !== app))
                  }}
                />
              )
            })}
          </FilterTag.Group>
        )}
      </div>
      <AdminLayoutList.TableResults
        segment="projects"
        itemsCount={filteredProjects.length}
        onClear={clearFilter}
      >
        <TableSortable.Root
          items={filteredProjects.map(project => project.id || 0)}
          onSort={handleSort}
        >
          <TableSortable.Header>
            <TableSortable.HeaderCell>Project</TableSortable.HeaderCell>
            <TableSortable.HeaderCell>App</TableSortable.HeaderCell>
            <TableSortable.HeaderCell>Status</TableSortable.HeaderCell>
          </TableSortable.Header>
          <TableSortable.Body>
            {filteredProjects.map(project => {
              const projectRoute = `/admin/insights/projects/${project.id}`

              const { statusLabel, statusColor } = match(project.status)
                .with('not-started', () => ({
                  statusLabel: 'Not started',
                  statusColor: colors.neutral[50],
                }))
                .with('in-progress', () => ({
                  statusLabel: 'In progress',
                  statusColor: colors.customisation.orange[50],
                }))
                .with('done', () => ({
                  statusLabel: 'Done',
                  statusColor: colors.success[50],
                }))
                .with('paused', () => ({
                  statusLabel: 'Paused',
                  statusColor: colors.neutral[50],
                }))
                .exhaustive()

              return (
                <TableSortable.Row
                  sortId={project.position}
                  key={project.id}
                  aria-selected={pathname === projectRoute}
                  disabled={!isAdmin || hasActiveFilter}
                  isAdmin={isAdmin}
                  onClick={() => {
                    showRightView()
                    router.push(projectRoute)
                  }}
                  name={project.name || ''}
                >
                  <TableSortable.Cell size={36}>
                    <div />
                    <span className="flex items-center gap-1 capitalize">
                      <InsightsAppIcon type={project.app} />
                      <span>{project.app}</span>
                    </span>
                  </TableSortable.Cell>
                  <TableSortable.Cell size={36} className="w-40">
                    <p className="flex flex-row items-center gap-2">
                      <InsightsStatusIcon status={project.status} />
                      <span style={{ color: statusColor }}>{statusLabel}</span>
                    </p>
                  </TableSortable.Cell>
                </TableSortable.Row>
              )
            })}
          </TableSortable.Body>
        </TableSortable.Root>
      </AdminLayoutList.TableResults>
    </AdminLayoutList>
  )
}
