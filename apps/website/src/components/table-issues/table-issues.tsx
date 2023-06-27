import { useState } from 'react'

import { Avatar, Button, Input, Tag, Text } from '@status-im/components'
import { ProfileIcon, SearchIcon } from '@status-im/icons'
import Link from 'next/link'

import { useCurrentBreakpoint } from '@/hooks/use-current-breakpoint'

import { DropdownFilter, DropdownSort, Tabs } from './filters'

import type { DropdownFilterProps } from './filters/dropdown-filter'
import type { DropdownSortProps } from './filters/dropdown-sort'

const issues = [
  {
    id: 5154,
    title: 'Add support for encrypted communities',
    status: 'open',
  },
  {
    id: 5155,
    title: 'Add support for encrypted communities',
    status: 'open',
  },
  {
    id: 4,
    title: 'Add support for encrypted communities',
    status: 'open',
  },
  {
    id: 4324,
    title: 'Add support for encrypted communities',
    status: 'open',
  },
  {
    id: 134,
    title: 'Add support for encrypted communities',
    status: 'closed',
  },
  {
    id: 999,
    title: 'Add support for encrypted communities',
    status: 'closed',
  },
  {
    id: 873,
    title: 'Add support for encrypted communities',
    status: 'open',
  },
  {
    id: 123,
    title: 'Add support for encrypted communities',
    status: 'open',
  },
]

const authors: DropdownFilterProps['data'] = [
  {
    id: 4,
    name: 'marcelines',
    avatar: 'https://avatars.githubusercontent.com/u/29401404?v=4',
  },
  {
    id: 5,
    name: 'prichodko',
    avatar: 'https://avatars.githubusercontent.com/u/14926950?v=4',
  },
  {
    id: 6,
    name: 'felicio',
    avatar: 'https://avatars.githubusercontent.com/u/13265126?v=4',
  },
  {
    id: 7,
    name: 'jkbktl',
    avatar: 'https://avatars.githubusercontent.com/u/520927?v=4',
  },
]

const epics: DropdownFilterProps['data'] = [
  {
    id: 4,
    name: 'E:ActivityCenter',
    color: '$orange-60',
  },
  {
    id: 5,
    name: 'E:Keycard',
    color: '$purple-60',
  },
  {
    id: 6,
    name: 'E:Wallet',
    color: '$pink-60',
  },
  {
    id: 7,
    name: 'E:Chat',
    color: '$beige-60',
  },
]

const labels: DropdownFilterProps['data'] = [
  {
    id: 4,
    name: 'Mobile',
    color: '$blue-60',
  },
  {
    id: 5,
    name: 'Frontend',
    color: '$brown-50',
  },
  {
    id: 6,
    name: 'Backend',
    color: '$red-60',
  },
  {
    id: 7,
    name: 'Desktop',
    color: '$green-60',
  },
]

const assignees: DropdownFilterProps['data'] = [
  {
    id: 1,
    name: 'Unassigned',
    avatar: <ProfileIcon size={16} />,
  },
  {
    id: 4,
    name: 'marcelines',
    avatar: 'https://avatars.githubusercontent.com/u/29401404?v=4',
  },
  {
    id: 5,
    name: 'prichodko',
    avatar: 'https://avatars.githubusercontent.com/u/14926950?v=4',
  },
  {
    id: 6,
    name: 'felicio',
    avatar: 'https://avatars.githubusercontent.com/u/13265126?v=4',
  },
  {
    id: 7,
    name: 'jkbktl',
    avatar: 'https://avatars.githubusercontent.com/u/520927?v=4',
  },
]

const repositories: DropdownFilterProps['data'] = [
  {
    id: 1,
    name: 'status-mobile',
  },
  {
    id: 2,
    name: 'status-desktop',
  },
  {
    id: 3,
    name: 'status-web',
  },
  {
    id: 4,
    name: 'status-go',
  },
  {
    id: 5,
    name: 'nwaku',
  },
  {
    id: 6,
    name: 'go-waku',
  },
  {
    id: 7,
    name: 'js-waku',
  },
  {
    id: 8,
    name: 'nimbus-eth2',
  },
  {
    id: 9,
    name: 'help.status.im',
  },
]

const sortOptions: DropdownSortProps['data'] = [
  {
    id: 1,
    name: 'Default',
  },
  {
    id: 2,
    name: 'Alphabetical',
  },
  {
    id: 3,
    name: 'Creation date',
  },
  {
    id: 4,
    name: 'Updated',
  },
  {
    id: 5,
    name: 'Completion',
  },
]

const TableIssues = () => {
  const [issuesSearchText, setIssuesSearchText] = useState('')

  const currentBreakpoint = useCurrentBreakpoint()

  return (
    <div className="overflow-hidden  rounded-2xl border border-neutral-10">
      <div className="flex border-b border-neutral-10 bg-neutral-5 p-3">
        <div className="flex w-full flex-col 2xl:flex-row 2xl:justify-between">
          <Tabs />
          <div className="flex-1">
            <div className="flex items-center 2xl:justify-end">
              <div className="flex w-full justify-between pt-4 2xl:justify-end 2xl:pt-0">
                <div className="flex gap-2">
                  <div className="transition-all">
                    <Input
                      placeholder="Find Author"
                      icon={<SearchIcon size={20} />}
                      size={32}
                      value={issuesSearchText}
                      onChangeText={setIssuesSearchText}
                      variant="retractable"
                      direction={currentBreakpoint === '2xl' ? 'rtl' : 'ltr'}
                    />
                  </div>

                  <DropdownFilter
                    data={authors}
                    label="Author"
                    placeholder="Find author"
                  />
                  <DropdownFilter
                    data={epics}
                    label="Epics"
                    placeholder="Find epic"
                  />
                  <DropdownFilter
                    data={labels}
                    label="Labels"
                    placeholder="Find label"
                  />
                  <DropdownFilter
                    data={assignees}
                    label="Assignee"
                    placeholder="Find assignee"
                  />
                  <DropdownFilter
                    data={repositories}
                    label="Repos"
                    placeholder="Find repo"
                  />
                </div>

                <div className="pl-2">
                  <DropdownSort data={sortOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="divide-y divide-neutral-10">
        {issues.map(issue => (
          <Link
            key={issue.id}
            href={`https://github.com/status-im/status-react/issues/${issue.id}`}
            className="flex items-center justify-between px-4 py-3 transition-colors duration-200 hover:bg-neutral-5"
          >
            <div className="flex flex-col">
              <Text size={15} weight="medium">
                {issue.title}
              </Text>
              <Text size={13} color="$neutral-50">
                #9667 • Opened 2 days ago by slaedjenic
              </Text>
            </div>

            <div className="flex gap-3">
              <div className="flex gap-1">
                <Tag size={24} label="E:Syncing" color="$orange-50" />
                <Tag size={24} label="E:Wallet" color="$green-50" />
                <Tag size={24} label="Feature" color="$pink-50" />
                <Tag size={24} label="Web" color="$purple-50" />
              </div>

              <Tag size={24} label="9435" />

              <Avatar
                type="user"
                size={24}
                name="jkbktl"
                src="https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1299&q=80"
              />
            </div>
          </Link>
        ))}
      </div>

      <div className="p-3">
        <Button size={40} variant="outline">
          Show more 10
        </Button>
      </div>
    </div>
  )
}

export { TableIssues }
