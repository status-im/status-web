'use client'

import { useState } from 'react'

import * as colors from '@status-im/colors'
import { DoneIcon, NotStartedIcon, OpenIcon } from '@status-im/icons/20'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { AddNewButton } from '~admin/_components/add-new-button'
import { FilterTag } from '~admin/_components/filter-tag'
import { MultiselectFilter } from '~admin/_components/multiselect-filter'
import { SearchInput } from '~admin/_components/search-input'
import { useLayoutContext } from '~admin/_contexts/layout-context'
import { useUserContext } from '~admin/_contexts/user-context'
import { useTableFilters } from '~admin/_hooks/use-table-filters'
import { useTableSort } from '~admin/_hooks/use-table-sort'
import { AdminLayoutList } from '~admin/_layouts/admin-layout-list'
import { getAdminStatusLabel } from '~admin/insights/_utils/i18n'
import { getColorWithOpacity } from '~app/_utils/get-color-with-opacity'
import { Table } from '~components/table'

import { InsightsStatusIcon } from '../../_components/insights-status-icon'

import type { MultiselectOption } from '~admin/_components/multiselect-filter'
import type { ApiOutput } from '~server/api/types'

type StatusItem = {
  id: string
  label: string
  color: string
  textColor?: string
  icon: React.FC<React.SVGProps<SVGSVGElement>>
}

const renderedStatusList: StatusItem[] = [
  {
    id: 'not-started',
    label: '',
    color: 'text-neutral-50',
    textColor: colors.neutral[50],
    icon: NotStartedIcon,
  },
  {
    id: 'in-progress',
    label: '',
    color: 'text-orange-50',
    textColor: colors.customisation.orange[50],
    icon: OpenIcon,
  },
  {
    id: 'done',
    label: '',
    color: 'text-success-50',
    textColor: colors.success[50],
    icon: DoneIcon,
  },
]

type Props = {
  epics: ApiOutput['epics']['all']
}

export const EpicsList = (props: Props) => {
  const { epics } = props
  const t = useTranslations('admin')

  const router = useRouter()
  const pathname = usePathname()

  const user = useUserContext()

  const [searchFilter, setSearchFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string[]>([])

  const { showRightView } = useLayoutContext()
  const statusFilterOptions: MultiselectOption[] = [
    {
      id: 'not-started',
      label: getAdminStatusLabel(t, 'not-started'),
      icon: <InsightsStatusIcon status="not-started" />,
    },
    {
      id: 'in-progress',
      label: getAdminStatusLabel(t, 'in-progress'),
      icon: <InsightsStatusIcon status="in-progress" />,
    },
    {
      id: 'done',
      label: getAdminStatusLabel(t, 'done'),
      icon: <InsightsStatusIcon status="done" />,
    },
  ]

  const clearFilter = () => {
    setSearchFilter('')
    setStatusFilter([])
  }

  const { items } = useTableSort({
    items: epics,
    searchColumn: 'name',
    searchFilter,
    initialOrderByColumn: 'name',
  })

  const { items: filteredEpics } = useTableFilters({
    items,
    filters: [
      {
        filterColumn: 'status',
        filterValue: statusFilter,
      },
    ],
  })

  return (
    <AdminLayoutList segment="epics">
      <div className="flex flex-col">
        <div className="flex flex-col gap-6">
          {user.canEditInsights && (
            <AddNewButton href="/admin/insights/epics/new">
              {t('newEpic')}
            </AddNewButton>
          )}
          <AdminLayoutList.Filters>
            <SearchInput
              value={searchFilter}
              onChange={setSearchFilter}
              placeholder={t('findEpics')}
            />
            <MultiselectFilter
              label={t('status')}
              options={statusFilterOptions}
              onSelectionChange={setStatusFilter}
              selection={statusFilter}
            />
          </AdminLayoutList.Filters>
        </div>
        {statusFilter.length > 0 && (
          <FilterTag.Group>
            {statusFilter.map(status => {
              return (
                <FilterTag.Item
                  key={status}
                  title={t('status')}
                  label={
                    statusFilterOptions.find(s => s.id === status)?.label || ''
                  }
                  onRemove={() => {
                    setStatusFilter(statusFilter.filter(f => f !== status))
                  }}
                />
              )
            })}
          </FilterTag.Group>
        )}
      </div>
      <AdminLayoutList.TableResults
        segment="epics"
        itemsCount={filteredEpics.length}
        onClear={clearFilter}
      >
        <Table.Root>
          <Table.Header>
            <Table.HeaderCell className="w-full">{t('label')}</Table.HeaderCell>
            <Table.HeaderCell minWidth={160}>{t('status')}</Table.HeaderCell>
          </Table.Header>
          <Table.Body>
            {filteredEpics.map(epic => {
              const epicStatus = renderedStatusList.find(
                option => option.id === epic.status
              )
              const epicStatusLabel = getAdminStatusLabel(t, epic.status)
              const epicRoute = `/admin/insights/epics/${epic.id}`
              return (
                <Table.Row
                  key={epic.id}
                  aria-selected={pathname === epicRoute}
                  onClick={() => {
                    showRightView()
                    router.push(epicRoute)
                  }}
                >
                  <Table.Cell size={36}>
                    <div className="flex flex-row items-center gap-2">
                      <div
                        className="size-4 rounded-full border-[1.2px]"
                        style={{
                          backgroundColor: getColorWithOpacity(epic.color, 0.4),
                          borderColor: epic.color,
                        }}
                      />
                      <span>{epic.name}</span>
                    </div>
                  </Table.Cell>

                  <Table.Cell size={36}>
                    <p className="flex flex-row items-center gap-2">
                      {epicStatus?.icon && (
                        <epicStatus.icon color={epicStatus?.color} />
                      )}
                      <span
                        style={{
                          color: epicStatus?.textColor,
                        }}
                      >
                        {epicStatusLabel}
                      </span>
                    </p>
                  </Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table.Root>
      </AdminLayoutList.TableResults>
    </AdminLayoutList>
  )
}
