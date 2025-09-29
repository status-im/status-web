'use client'

import { useMemo, useState } from 'react'

import { cx } from 'class-variance-authority'
import { matchSorter } from 'match-sorter'

import * as Drawer from '~admin/_components/drawer'
import { EmptySearchResults } from '~admin/_components/empty-search-results'
import { MultiselectFilter } from '~admin/_components/multiselect-filter'
import { SearchInput } from '~admin/_components/search-input'
import { matchesSearchFilter } from '~admin/_utils'
import {
  projectAppOptions,
  projectStatusOptions,
} from '~admin/insights/projects/_components/projects-list'

import { ProjectItem } from './project-item'

import type { ApiOutput } from '~server/api/types'

type Props = {
  title: string
  projects: ApiOutput['projects']['all']
  children: React.ReactElement
  selection: number[]
  onSelectionChange: (ids: number[]) => void
}

export const ReportsDrawer = (props: Props) => {
  const { children, projects, selection, onSelectionChange } = props

  const [open, setOpen] = useState(false)

  const onClose = () => {
    setOpen(false)
  }

  return (
    <Drawer.Root modal open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>{children}</Drawer.Trigger>
      <Drawer.Content>
        <ReportsDrawerList
          projects={projects}
          initialSelection={selection}
          onSave={ids => {
            onSelectionChange(ids)
            onClose()
          }}
        />
      </Drawer.Content>
    </Drawer.Root>
  )
}

type ReportsDrawerListProps = {
  projects: ApiOutput['projects']['all']
  initialSelection: number[]
  onSave: (ids: Array<number>) => void
}

const ReportsDrawerList = (props: ReportsDrawerListProps) => {
  const { projects, initialSelection, onSave } = props

  const [milestoneIds, setMilestoneIds] = useState<number[]>(initialSelection)

  const [searchFilter, setSearchFilter] = useState<string>('')
  const [appsFilter, setAppsFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string[]>([])

  const onClear = () => {
    setSearchFilter('')
    setAppsFilter([])
    setStatusFilter([])
  }

  const filteredProjects = useMemo(
    () =>
      projects.reduce(
        (acc, project) => {
          const projectNameMatches = matchesSearchFilter(
            project.name,
            searchFilter
          )

          if (!(appsFilter.length === 0 || appsFilter.includes(project.app))) {
            return acc
          }

          const nameFilteredMilestones = matchSorter(
            project.milestones,
            searchFilter,
            { keys: ['name'] }
          )

          if (projectNameMatches || nameFilteredMilestones.length > 0) {
            const finalMilestones = (
              projectNameMatches ? project.milestones : nameFilteredMilestones
            ).filter(
              milestone =>
                statusFilter.length === 0 ||
                statusFilter.includes(milestone.status)
            )
            acc.push({
              ...project,
              milestones: finalMilestones,
            })
          }

          return acc
        },
        [] as ApiOutput['projects']['all']
      ),
    [projects, searchFilter, appsFilter, statusFilter]
  )

  const milestonesCount = filteredProjects.reduce(
    (acc, project) => acc + project.milestones.length,
    0
  )

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Add project milestones</Drawer.Title>
        <Drawer.Filters>
          <SearchInput
            value={searchFilter}
            onChange={setSearchFilter}
            placeholder="Find milestones"
          />
          <MultiselectFilter
            label="App"
            options={projectAppOptions}
            selection={appsFilter}
            onSelectionChange={setAppsFilter}
          />
          <MultiselectFilter
            label="Status"
            options={projectStatusOptions}
            selection={statusFilter}
            onSelectionChange={setStatusFilter}
          />
        </Drawer.Filters>
      </Drawer.Header>

      <Drawer.Body className="divide-y divide-neutral-10">
        {(filteredProjects.length === 0 || milestonesCount === 0) && (
          <EmptySearchResults segment="milestones" onClear={onClear} />
        )}
        {filteredProjects.map(project => {
          if (project.milestones.length === 0) {
            return null
          }

          return (
            <ProjectItem
              key={project.id}
              title={project.name}
              selection={milestoneIds}
              onSelect={milestoneId =>
                setMilestoneIds([...milestoneIds, milestoneId])
              }
              onRemove={milestoneId =>
                setMilestoneIds(milestoneIds.filter(id => id !== milestoneId))
              }
              app={project.app}
              milestones={project.milestones}
            />
          )
        })}
      </Drawer.Body>
      <Drawer.Footer>
        <div className="flex flex-1">
          <button
            onClick={() => onSave(milestoneIds)}
            className={cx(
              'flex h-[42px] w-full items-center justify-center gap-1 rounded-12',
              'bg-customisation-blue-50 text-15 font-medium text-white-100 transition-colors',
              'active:bg-customisation-blue-60 hover:bg-customisation-blue-60 disabled:bg-customisation-blue-50/20'
            )}
          >
            Save Changes
          </button>
        </div>
      </Drawer.Footer>
    </>
  )
}
