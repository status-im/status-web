'use client'

import { useMemo, useState, useTransition } from 'react'

import { LoadingIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'
import { matchSorter } from 'match-sorter'

import * as Drawer from '~admin/_components/drawer'
import { MultiselectFilter } from '~admin/_components/multiselect-filter'
import { SearchInput } from '~admin/_components/search-input'
import { SelectionIndicator } from '~admin/_components/selection-indicator'

import { InsightsAppIcon } from '../../_components/insights-app-icon'
import { InsightsStatusIcon } from '../../_components/insights-status-icon'
import {
  projectAppOptions,
  projectStatusOptions,
} from '../../projects/_components/projects-list'

import type { ApiOutput } from '~server/api/types'

type Props = {
  children: React.ReactElement
  projects: ApiOutput['projects']['all']
  selection: number[]
  onSelectionChange: (ids: number[]) => void
  onSubmit: () => void | Promise<void>
}

export const AddProjectsDrawer = (props: Props) => {
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
    let filtered = projects

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
  }, [projects, searchFilter, appFilter, statusFilter])

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Add Project</Drawer.Title>
        <Drawer.Filters>
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
        </Drawer.Filters>
      </Drawer.Header>
      <Drawer.Body>
        <div className="grid gap-2">
          {filteredProjects.map(project => {
            const selected = selection.includes(project.id)
            return (
              <button
                key={project.id}
                type="button"
                className={cx([
                  'block rounded-16 border text-left',
                  selected
                    ? 'border-customisation-blue-50/20 bg-customisation-blue-50/5'
                    : 'border-neutral-20',
                ])}
                onClick={() => {
                  if (selected) {
                    onSelectionChange(selection.filter(id => id !== project.id))
                  } else {
                    onSelectionChange([...selection, project.id])
                  }
                }}
              >
                <div className="relative grid grid-cols-[auto,1fr,auto] gap-3 p-3">
                  <InsightsStatusIcon status={project.status} />
                  <div>
                    <div className="text-13 font-medium">{project.name}</div>
                    <div className="mb-2 text-13 font-regular">
                      {project.description}
                    </div>
                    <div className="flex items-center gap-1 text-13 font-medium capitalize">
                      <InsightsAppIcon type={project.app} />
                      {project.app}
                    </div>
                  </div>
                  <div>
                    <SelectionIndicator selected={selected} />
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </Drawer.Body>

      <Drawer.Footer>
        <button
          type="button"
          className="flex h-10 w-full items-center justify-center gap-1 rounded-16 bg-customisation-blue-50 text-15 font-medium text-white-100 transition-colors active:bg-customisation-blue-60 hover:bg-customisation-blue-60 disabled:bg-customisation-blue-50/20"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? <LoadingIcon /> : 'Save'}
        </button>
      </Drawer.Footer>
    </>
  )
}
