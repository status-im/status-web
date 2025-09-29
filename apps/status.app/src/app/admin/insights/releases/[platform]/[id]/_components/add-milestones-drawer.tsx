'use client'

import { useMemo, useState, useTransition } from 'react'

import { LoadingIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'

import * as Drawer from '~admin/_components/drawer'
import { MultiselectFilter } from '~admin/_components/multiselect-filter'
import { SearchInput } from '~admin/_components/search-input'
import { SelectionIndicator } from '~admin/_components/selection-indicator'
import { matchesSearchFilter } from '~admin/_utils'
import { InsightsAppIcon } from '~admin/insights/_components/insights-app-icon'
import { InsightsStatusIcon } from '~admin/insights/_components/insights-status-icon'
import {
  projectAppOptions,
  projectStatusOptions,
} from '~admin/insights/projects/_components/projects-list'

import type { ApiOutput } from '~server/api/types'

type Props = {
  children: React.ReactElement
  projects: ApiOutput['projects']['all']
  selection: number[]
  onSelectionChange: (ids: number[]) => void
  onSubmit: () => Promise<void> | void
}

export const AddMilestonesDrawer = (props: Props) => {
  const { children, onSubmit, ...contentProps } = props

  const [open, setOpen] = useState(false)

  const [isPending, startTransition] = useTransition()

  const handleSubmit = () => {
    startTransition(async () => {
      await onSubmit()
      setOpen(false)
    })
  }

  return (
    <Drawer.Root modal open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>{children}</Drawer.Trigger>
      <Drawer.Content>
        <DrawerContent
          {...contentProps}
          loading={isPending}
          onSubmit={handleSubmit}
        />
      </Drawer.Content>
    </Drawer.Root>
  )
}

const DrawerContent = (
  props: Omit<Props, 'children'> & { loading: boolean }
) => {
  const { projects, selection, onSelectionChange, loading, onSubmit } = props

  const [searchFilter, setSearchFilter] = useState<string>('')
  const [appFilter, setAppFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string[]>([])

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      if (appFilter.length > 0 && !appFilter.includes(project.app)) {
        return false
      }

      if (statusFilter.length > 0 && !statusFilter.includes(project.status)) {
        return false
      }

      if (searchFilter.length > 0) {
        if (!matchesSearchFilter(project.name, searchFilter)) {
          return false
        }
      }

      return true
    })
  }, [searchFilter, appFilter, statusFilter, projects])

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Add milestones</Drawer.Title>
        <Drawer.Filters>
          <SearchInput
            value={searchFilter}
            onChange={setSearchFilter}
            placeholder="Find milestones"
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
        </Drawer.Filters>
      </Drawer.Header>

      <Drawer.Body>
        <div className="grid gap-2">
          {filteredProjects.map(project => {
            if (project.milestones.length === 0) {
              return null
            }

            return (
              <div key={project.id} className="py-4 first-of-type:pt-0">
                <div className="mb-3 flex gap-1 text-13 font-medium">
                  <InsightsAppIcon type={project.app} />
                  {project.name}
                </div>
                <div className="grid gap-2">
                  {project.milestones.map(milestone => {
                    const selected = selection.includes(milestone.id)

                    return (
                      <button
                        key={milestone.id}
                        className={cx([
                          'relative grid grid-cols-[auto,1fr,auto] gap-3 rounded-16 border border-neutral-20 p-3 text-left',
                          selected &&
                            'border-customisation-blue-50/20 bg-customisation-blue-50/5',
                        ])}
                        onClick={() => {
                          if (selected) {
                            onSelectionChange(
                              selection.filter(id => id !== milestone.id)
                            )
                          } else {
                            onSelectionChange([...selection, milestone.id])
                          }
                        }}
                      >
                        <div>
                          <InsightsStatusIcon status={milestone.status} />
                        </div>
                        <div>
                          <div className="text-13 font-medium">
                            {milestone.name}
                          </div>
                          <div className="text-13 font-regular">
                            {milestone.description}
                          </div>
                        </div>
                        <div>
                          <SelectionIndicator selected={selected} />
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </Drawer.Body>

      <Drawer.Footer>
        <button
          type="button"
          className="flex h-10 w-full items-center justify-center gap-1 rounded-16 bg-customisation-blue-50 text-15 font-medium text-white-100 transition-colors active:bg-customisation-blue-60 hover:bg-customisation-blue-60 disabled:bg-customisation-blue-50/20"
          disabled={loading}
          onClick={onSubmit}
        >
          {loading ? <LoadingIcon /> : 'Save'}
        </button>
      </Drawer.Footer>
    </>
  )
}
