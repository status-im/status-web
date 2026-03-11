'use client'

import { useMemo, useOptimistic, useState, useTransition } from 'react'

import { arrayMove } from '@dnd-kit/sortable'
import * as colors from '@status-im/colors'
import { matchSorter } from 'match-sorter'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { match } from 'ts-pattern'

import { AddNewButton } from '~admin/_components/add-new-button'
import { FilterTag } from '~admin/_components/filter-tag'
import { MultiselectFilter } from '~admin/_components/multiselect-filter'
import { SearchInput } from '~admin/_components/search-input'
import { useLayoutContext } from '~admin/_contexts/layout-context'
import { useUserContext } from '~admin/_contexts/user-context'
import { AdminLayoutList } from '~admin/_layouts/admin-layout-list'
import {
  getAdminAppLabel,
  getAdminStatusLabel,
  getProjectAppOptions,
  getProjectStatusOptions,
} from '~admin/insights/_utils/i18n'

import { InsightsAppIcon } from '../../_components/insights-app-icon'
import { InsightsStatusIcon } from '../../_components/insights-status-icon'
import { updateProjectPosition } from '../_actions'
import { TableSortable } from './table-sortable'

import type { ApiOutput } from '~server/api/types'

type Props = {
  projects: ApiOutput['projects']['all']
  isAdmin?: boolean
}

export const ProjectsList = (props: Props) => {
  const { projects, isAdmin } = props
  const t = useTranslations('admin')

  const router = useRouter()
  const pathname = usePathname()

  const user = useUserContext()

  const [optimisticProjects, setOptimisticProjects] = useOptimistic(projects)

  const [, startTransition] = useTransition()

  const [searchFilter, setSearchFilter] = useState<string>('')
  const [appFilter, setAppFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string[]>([])

  const { showRightView } = useLayoutContext()
  const projectAppOptions = getProjectAppOptions(t)
  const projectStatusOptions = getProjectStatusOptions(t)

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
              {t('newProject')}
            </AddNewButton>
          )}

          <AdminLayoutList.Filters>
            <SearchInput
              placeholder={t('findProjects')}
              value={searchFilter}
              onChange={setSearchFilter}
            />
            <MultiselectFilter
              label={t('app')}
              options={projectAppOptions}
              selection={appFilter}
              onSelectionChange={setAppFilter}
            />
            <MultiselectFilter
              label={t('status')}
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
                  title={t('status')}
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
                  title={t('app')}
                  label={projectAppOptions.find(p => p.id === app)?.label || ''}
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
            <TableSortable.HeaderCell>{t('project')}</TableSortable.HeaderCell>
            <TableSortable.HeaderCell>{t('app')}</TableSortable.HeaderCell>
            <TableSortable.HeaderCell>{t('status')}</TableSortable.HeaderCell>
          </TableSortable.Header>
          <TableSortable.Body>
            {filteredProjects.map(project => {
              const projectRoute = `/admin/insights/projects/${project.id}`

              const { statusLabel, statusColor } = match(project.status)
                .with('not-started', () => ({
                  statusLabel: getAdminStatusLabel(t, 'not-started'),
                  statusColor: colors.neutral[50],
                }))
                .with('in-progress', () => ({
                  statusLabel: getAdminStatusLabel(t, 'in-progress'),
                  statusColor: colors.customisation.orange[50],
                }))
                .with('done', () => ({
                  statusLabel: getAdminStatusLabel(t, 'done'),
                  statusColor: colors.success[50],
                }))
                .with('paused', () => ({
                  statusLabel: getAdminStatusLabel(t, 'paused'),
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
                      <span>{getAdminAppLabel(t, project.app)}</span>
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
