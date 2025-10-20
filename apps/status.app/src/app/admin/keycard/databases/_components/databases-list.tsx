'use client'

import { useState } from 'react'

import { usePathname, useRouter } from 'next/navigation'

import { AddNewButton } from '~admin/_components/add-new-button'
import { DatabaseList } from '~admin/_components/database-list'
import { AdminDropdownSort } from '~admin/_components/dropdown-sort'
import { SearchInput } from '~admin/_components/search-input'
import { useLayoutContext } from '~admin/_contexts/layout-context'
import { useUserContext } from '~admin/_contexts/user-context'
import { useTableSort } from '~admin/_hooks/use-table-sort'
import { AdminLayoutList } from '~admin/_layouts/admin-layout-list'

type Database = {
  id: string
  name: string
  erc20url: string
  chainUrl: string
  date: string
  addedBy: string
  file: {
    url: string
    name: string
  }
}

const fakeDatabases = [
  {
    id: '1',
    name: 'Database 1',
    erc20url: 'https://pdfwatermarker.com/kpro-tmp/20221123/erc20.json',
    chainUrl: 'https://pdfwatermarker.com/kpro-tmp/20221123/chain.json',
    date: '23/11/22',
    addedBy: 'Guy Louis',
    file: {
      url: 'https://pdfwatermarker.com/kpro-tmp/20221123/db.json',
      name: 'db.json',
    },
  },
  {
    id: '2',
    name: 'Database 2',
    erc20url: 'https://pdfwatermarker.com/kpro-tmp/20221128/erc20.json',
    chainUrl: 'https://pdfwatermarker.com/kpro-tmp/20221128/chain.json',
    date: '28/11/22',
    addedBy: 'Guy Louis',
    file: {
      url: 'https://pdfwatermarker.com/kpro-tmp/20221128/db.json',
      name: 'db.json',
    },
  },
  {
    id: '3',
    name: 'Database 3',
    erc20url: 'https://pdfwatermarker.com/kpro-tmp/20231201/erc20.json',
    chainUrl: 'https://pdfwatermarker.com/kpro-tmp/20231201/chain.json',
    date: '01/12/23',
    addedBy: 'Guy Louis',
    file: {
      url: 'https://pdfwatermarker.com/kpro-tmp/20221201/db.json',
      name: 'db.json',
    },
  },
  {
    id: '4',
    name: 'Database 4',
    erc20url: 'https://pdfwatermarker.com/kpro-tmp/20231205/erc20.json',
    chainUrl: 'https://pdfwatermarker.com/kpro-tmp/20231205/chain.json',
    date: '05/12/23',
    addedBy: 'Michele',
    file: {
      url: 'https://pdfwatermarker.com/kpro-tmp/20231205/db.json',
      name: 'db.json',
    },
  },
  {
    id: '5',
    name: 'Database 5',
    erc20url: 'https://pdfwatermarker.com/kpro-tmp/20240101/erc20.json',
    chainUrl: 'https://pdfwatermarker.com/kpro-tmp/20240101/chain.json',
    date: '01/01/24',
    addedBy: 'Michele',
    file: {
      url: 'https://pdfwatermarker.com/kpro-tmp/20240101/db.json',
      name: 'db.json',
    },
  },
]

const orderByData = {
  date: 'Added date',
}

const DatabasesList = () => {
  const { showRightView } = useLayoutContext()

  const router = useRouter()
  const pathname = usePathname()

  const user = useUserContext()

  const [searchFilter, setSearchFilter] = useState<string>('')

  const {
    items: sortedDatabases,
    onOrderByChange,
    orderByColumn,
    ascending,
  } = useTableSort<Database>({
    items: fakeDatabases,
    searchColumn: 'name',
    searchFilter,
    initialOrderByColumn: 'date',
  })

  const clearSearch = () => {
    setSearchFilter('')
  }

  return (
    <AdminLayoutList segment="databases">
      <div className="flex flex-col gap-6">
        {user.canEditKeycard && (
          <AddNewButton href="/admin/keycard/databases/new">
            New database
          </AddNewButton>
        )}
        <AdminLayoutList.Filters>
          <SearchInput
            value={searchFilter}
            onChange={setSearchFilter}
            placeholder="Find devices"
          />
          <AdminDropdownSort
            data={orderByData}
            onOrderByChange={onOrderByChange}
            orderByColumn={orderByColumn}
            ascending={ascending}
          />
        </AdminLayoutList.Filters>
      </div>

      <AdminLayoutList.TableResults
        segment="databases"
        itemsCount={sortedDatabases.length}
        onClear={clearSearch}
      >
        <DatabaseList.Root>
          {sortedDatabases.map(item => {
            const { erc20url, chainUrl, date, addedBy } = item

            const databaseRoute = `/admin/keycard/databases/${item.id}`

            return (
              <DatabaseList.Item
                key={item.id}
                item={item}
                aria-selected={pathname === databaseRoute}
                onClick={() => {
                  router.push(databaseRoute)
                  showRightView()
                }}
              >
                <DatabaseList.ItemRow
                  label="ERC-20 URL"
                  value={erc20url}
                  type="link"
                />
                <DatabaseList.ItemRow
                  label="Chain URL"
                  value={chainUrl}
                  type="link"
                />
                <DatabaseList.ItemRow label="Date" value={date} type="text" />
                <DatabaseList.ItemRow
                  label="Added By"
                  value={addedBy}
                  type="user"
                />
              </DatabaseList.Item>
            )
          })}
        </DatabaseList.Root>
      </AdminLayoutList.TableResults>
    </AdminLayoutList>
  )
}

export { DatabasesList }
