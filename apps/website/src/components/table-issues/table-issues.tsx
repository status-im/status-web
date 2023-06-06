import { useRef, useState } from 'react'

import { Avatar, Button, Input, Tag, Text } from '@status-im/components'
import { OpenIcon, SearchIcon } from '@status-im/icons'
import Link from 'next/link'

import { FilterAuthor } from './filters/filter-author'

import type { TextInput } from 'react-native'

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

const authors = [
  {
    id: 1,
    name: 'Tobias',
    avatar:
      'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80',
  },
  {
    id: 2,
    name: 'Arnold',
    avatar:
      'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80',
  },
  {
    id: 3,
    name: 'Alisher',
    avatar:
      'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80',
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

export const TableIssues = () => {
  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open')

  const [issuesSearchText, setIssuesSearchText] = useState('')
  const inputRef = useRef<TextInput>(null)
  const [isMinimized, setIsMinimized] = useState(true)

  return (
    <div className="border-neutral-10  overflow-hidden rounded-2xl border">
      <div className="bg-neutral-5 border-neutral-10 flex border-b p-3">
        <div className="flex">
          <div className="pr-3">
            <Button
              size={32}
              variant={activeTab === 'open' ? 'darkGrey' : 'grey'}
              onPress={() => setActiveTab('open')}
              icon={<OpenIcon size={20} />}
            >
              784 Open
            </Button>
          </div>
          <div className="pr-3">
            <Button
              size={32}
              variant={activeTab === 'closed' ? 'darkGrey' : 'grey'}
              onPress={() => setActiveTab('closed')}
            >
              1012 closed
            </Button>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-end">
            <div className="flex px-1">
              <Input
                placeholder="Find Author"
                icon={<SearchIcon size={20} />}
                size={32}
                value={issuesSearchText}
                onChangeText={setIssuesSearchText}
                onHandleMinimized={() => setIsMinimized(!isMinimized)}
                minimized={isMinimized}
                direction="rtl"
                ref={inputRef}
              />
            </div>
            <FilterAuthor authors={authors} />
            <div className="pr-3">
              <Button size={32} variant="ghost">
                Filter
              </Button>
            </div>
            <div className="pr-3">
              <Button size={32} variant="ghost">
                Sort
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="divide-neutral-10 divide-y">
        {issues.map(issue => (
          <Link
            key={issue.id}
            href={`https://github.com/status-im/status-react/issues/${issue.id}`}
            className="hover:bg-neutral-5 flex items-center justify-between px-4 py-3 transition-colors duration-200"
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
