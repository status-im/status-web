'use client'

import { useMemo, useState } from 'react'

import { DropdownButton } from '@status-im/components'
import { usePathname, useRouter } from 'next/navigation'

import { AddNewButton } from '~admin/_components/add-new-button'
import { AdminDropdownSort } from '~admin/_components/dropdown-sort'
import { FilterTag } from '~admin/_components/filter-tag'
import { InsightsCombobox } from '~admin/_components/insights-combobox'
import { SearchInput } from '~admin/_components/search-input'
import { useLayoutContext } from '~admin/_contexts/layout-context'
import { useUserContext } from '~admin/_contexts/user-context'
import { useTableFilters } from '~admin/_hooks/use-table-filters'
import { useTableSort } from '~admin/_hooks/use-table-sort'
import { AdminLayoutList } from '~admin/_layouts/admin-layout-list'
import { InsightsAppIcon } from '~admin/insights/_components/insights-app-icon'
import { Table } from '~components/table'

import type { ApiOutput } from '~server/api/types'

const orderByData = {
  name: 'Alphabetical',
  createdAt: 'Created date',
}

type Props = {
  workstreams: ApiOutput['workstreams']['all']
  projects: ApiOutput['projects']['all']
}

const APP_COLORS = {
  shell: '#1992D7',
  communities: '#2A799B',
  messenger: '#7140FD',
  wallet: '#F6B03C',
  browser: '#EC266C',
  node: '#CB6256',
} as const

export const WorkstreamsList = (props: Props) => {
  const { workstreams, projects } = props

  const router = useRouter()
  const pathname = usePathname()

  const user = useUserContext()

  const [searchFilter, setSearchFilter] = useState<string>('')
  const [projectsFilter, setProjectsFilter] = useState<number[]>([])

  const { showRightView } = useLayoutContext()

  const clearFilter = () => {
    setSearchFilter('')
    setProjectsFilter([])
  }

  const { items, onOrderByChange, ascending, orderByColumn } = useTableSort({
    items: workstreams,
    searchColumn: 'name',
    searchFilter,
    initialOrderByColumn: 'name',
  })

  const projectsComboboxOptions = useMemo(
    () =>
      projects.map(project => ({
        id: project.id,
        name: project.name,
        color: APP_COLORS[project.app],
        status: project.status,
        icon: <InsightsAppIcon type={project.app} />,
      })),
    [projects]
  )

  const { items: filteredWorkstreams } = useTableFilters({
    items,
    filters: [
      {
        filterColumn: 'projects',
        filterValue: projectsFilter,
        filterKey: 'id',
      },
    ],
  })

  return (
    <AdminLayoutList segment="workstreams">
      <div className="flex flex-col">
        <div className="flex flex-col gap-6">
          {user.canEditInsights && (
            <AddNewButton href="/admin/insights/workstreams/new">
              New workstream
            </AddNewButton>
          )}
          <AdminLayoutList.Filters>
            <SearchInput
              value={searchFilter}
              onChange={setSearchFilter}
              placeholder="Find workstreams"
            />
            <InsightsCombobox
              items={projectsComboboxOptions}
              selection={projectsFilter}
              onSelectionChange={setProjectsFilter}
            >
              <DropdownButton variant="outline" size="32">
                Projects
              </DropdownButton>
            </InsightsCombobox>

            <AdminDropdownSort
              data={orderByData}
              onOrderByChange={onOrderByChange}
              orderByColumn={orderByColumn}
              ascending={ascending}
            />
          </AdminLayoutList.Filters>
        </div>
        {projectsFilter.length > 0 && (
          <FilterTag.Group>
            {projectsFilter.map(project => {
              return (
                <FilterTag.Item
                  key={project}
                  title="Projects"
                  label={projects.find(p => p.id === project)?.name || ''}
                  onRemove={() => {
                    setProjectsFilter(projectsFilter.filter(f => f !== project))
                  }}
                />
              )
            })}
          </FilterTag.Group>
        )}
      </div>

      <AdminLayoutList.TableResults
        segment="workstreams"
        itemsCount={filteredWorkstreams.length}
        onClear={clearFilter}
      >
        <Table.Root>
          <Table.Header>
            <Table.HeaderCell>Workstream</Table.HeaderCell>
            <Table.HeaderCell minWidth={160}>Projects</Table.HeaderCell>
            {/* <Table.HeaderCell>Date</Table.HeaderCell> */}
          </Table.Header>
          <Table.Body>
            {filteredWorkstreams.map(workstream => {
              const workstreamRoute = `/admin/insights/workstreams/${workstream.id}`
              return (
                <Table.Row
                  key={workstream.id}
                  aria-selected={pathname === workstreamRoute}
                  onClick={() => {
                    showRightView()
                    router.push(workstreamRoute)
                  }}
                >
                  <Table.Cell size={36}>
                    <div className="flex flex-row items-center gap-2">
                      <span className="text-15">{workstream.emoji}</span>
                      <span>{workstream.name}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell size={36}>
                    <Table.Tags
                      tags={workstream.projects.map(project => ({
                        id: project.id,
                        name: project.name,
                        color: APP_COLORS[project.app],
                      }))}
                    />
                  </Table.Cell>
                  {/* <Table.Cell size={36}>
                    {shortDate(workstream.createdAt)}
                  </Table.Cell> */}
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table.Root>
      </AdminLayoutList.TableResults>
    </AdminLayoutList>
  )
}
