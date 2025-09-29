'use client'

import { useMemo, useState } from 'react'

import { DropdownButton } from '@status-im/components'
import { usePathname, useRouter } from 'next/navigation'

import { AdminDropdownSort } from '~admin/_components/dropdown-sort'
import { FilterTag } from '~admin/_components/filter-tag'
import { InsightsCombobox } from '~admin/_components/insights-combobox'
import { MultiselectFilter } from '~admin/_components/multiselect-filter'
import { SearchInput } from '~admin/_components/search-input'
import { useLayoutContext } from '~admin/_contexts/layout-context'
import { useTableFilters } from '~admin/_hooks/use-table-filters'
import { useTableSort } from '~admin/_hooks/use-table-sort'
import { AdminLayoutList } from '~admin/_layouts/admin-layout-list'
import { formatDate } from '~app/_utils/format-date'
import { Table } from '~components/table'

import { InsightsAppIcon } from '../../_components/insights-app-icon'
import { CircularProgress } from './circular-progress'

import type { ApiOutput } from '~server/api/types'

const orderByData = {
  // version: 'Numerical (release)',
  dueOn: 'Due date',
}

const platformsOptions = [
  { id: 'desktop' as const, label: '🌍 Desktop' },
  { id: 'mobile' as const, label: '📱 Mobile' },
  // { id: 'web', label: '🍿 Web' },
]

type Props = {
  releases: ApiOutput['releases']['all']
}

export const ReleasesList = (props: Props) => {
  const { releases } = props

  const { showRightView } = useLayoutContext()

  const router = useRouter()
  const pathname = usePathname()

  const [searchFilter, setSearchFilter] = useState<string>('')
  const [platformsFilter, setPlatformsFilter] = useState<string[]>([])
  const [milestonesFilter, setMilestonesFilter] = useState<number[]>([])

  const { items, onOrderByChange, ascending, orderByColumn } = useTableSort({
    items: releases,
    searchColumn: 'title',
    searchFilter,
    initialOrderByColumn: 'title',
  })

  const { items: filteredReleases } = useTableFilters({
    items,
    filters: [
      {
        filterColumn: 'milestones',
        filterValue: milestonesFilter,
        filterKey: 'id',
      },
      {
        filterColumn: 'platform',
        filterValue: platformsFilter,
      },
    ],
  })

  const clearFilter = () => {
    setSearchFilter('')
    setPlatformsFilter([])
    setMilestonesFilter([])
  }

  const milestonesComboboxOptions = useMemo(
    () =>
      releases
        .flatMap(release => release.milestones)
        .map(milestone => ({
          id: milestone.id,
          name: milestone.name,
          color: milestone.status === 'done' ? 'green' : 'blue',
          status: milestone.status,
          icon: <InsightsAppIcon type={milestone.project.app} />,
        }))
        .filter(
          (milestone, index, self) =>
            index === self.findIndex(m => m.id === milestone.id)
        ),
    [releases]
  )

  return (
    <AdminLayoutList segment="releases">
      <div className="flex flex-col">
        <div className="flex flex-col gap-6">
          <AdminLayoutList.Filters>
            <SearchInput
              value={searchFilter}
              onChange={setSearchFilter}
              placeholder="Find releases"
            />

            <MultiselectFilter
              label="Platform"
              options={platformsOptions}
              selection={platformsFilter}
              onSelectionChange={setPlatformsFilter}
            />

            <InsightsCombobox
              placeholder="Find milestones"
              items={milestonesComboboxOptions}
              selection={milestonesFilter}
              onSelectionChange={setMilestonesFilter}
            >
              <DropdownButton variant="outline" size="32">
                Milestones
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
        {(platformsFilter.length > 0 || milestonesFilter.length > 0) && (
          <FilterTag.Group>
            {platformsFilter.map(platform => {
              return (
                <FilterTag.Item
                  key={platform}
                  title="Platform"
                  label={
                    platformsOptions.find(p => p.id === platform)?.label || ''
                  }
                  onRemove={() => {
                    setPlatformsFilter(
                      platformsFilter.filter(f => f !== platform)
                    )
                  }}
                />
              )
            })}
            {milestonesFilter.map(milestone => {
              return (
                <FilterTag.Item
                  key={milestone}
                  title="Milestone"
                  label={
                    milestonesComboboxOptions.find(m => m.id === milestone)
                      ?.name || ''
                  }
                  onRemove={() => {
                    setMilestonesFilter(
                      milestonesFilter.filter(f => f !== milestone)
                    )
                  }}
                />
              )
            })}
          </FilterTag.Group>
        )}
      </div>
      <AdminLayoutList.TableResults
        segment="releases"
        itemsCount={filteredReleases.length}
        onClear={clearFilter}
      >
        <Table.Root>
          <Table.Header>
            <Table.HeaderCell>Release</Table.HeaderCell>
            <Table.HeaderCell>Platform</Table.HeaderCell>
            <Table.HeaderCell>Milestones</Table.HeaderCell>
            <Table.HeaderCell>Due date</Table.HeaderCell>
          </Table.Header>
          <Table.Body>
            {filteredReleases.map(release => {
              const releaseRoute = `/admin/insights/releases/${release.platform}/${release.id}`
              return (
                <Table.Row
                  key={release.id}
                  aria-selected={pathname === releaseRoute}
                  onClick={() => {
                    showRightView()
                    router.push(releaseRoute)
                  }}
                >
                  <Table.Cell size={36} className="!text-neutral-100">
                    {release.title}
                  </Table.Cell>
                  <Table.Cell
                    size={36}
                    className="whitespace-nowrap !text-neutral-100"
                  >
                    {
                      platformsOptions.find(
                        option => option.id === release.platform
                      )!.label
                    }
                  </Table.Cell>
                  <Table.Cell size={36}>
                    <CircularProgress
                      completed={
                        release.milestones.filter(
                          milestone => milestone.status === 'done'
                        ).length
                      }
                      total={release.milestones.length}
                    />
                  </Table.Cell>
                  <Table.Cell size={36}>{formatDate(release.dueOn)}</Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table.Root>
      </AdminLayoutList.TableResults>
    </AdminLayoutList>
  )
}
