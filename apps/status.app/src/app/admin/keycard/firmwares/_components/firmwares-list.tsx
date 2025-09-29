'use client'

import { useState } from 'react'

import { Avatar } from '@status-im/components'
import { AttachIcon } from '@status-im/icons/16'
import { usePathname, useRouter } from 'next/navigation'

import { AddNewButton } from '~admin/_components/add-new-button'
import { AdminDropdownSort } from '~admin/_components/dropdown-sort'
import { SearchInput } from '~admin/_components/search-input'
import { useLayoutContext } from '~admin/_contexts/layout-context'
import { useUserContext } from '~admin/_contexts/user-context'
import { useTableSort } from '~admin/_hooks/use-table-sort'
import { AdminLayoutList } from '~admin/_layouts/admin-layout-list'
import { Table } from '~components/table'

type Firmware = {
  version: string
  file: {
    name: string
    path: string
  }
  date: string
  addedBy: string
}

const fakeFirmwares: Firmware[] = [
  {
    version: '1.0.12',
    file: {
      name: '20230001',
      path: '',
    },
    date: '01/15/23',
    addedBy: 'John Lea',
  },
  {
    version: '1.0.13',
    file: {
      name: '20230002',
      path: '',
    },
    date: '03/22/23',
    addedBy: 'Guy Louis',
  },
  {
    version: '1.0.14',
    file: {
      name: '20230003',
      path: '',
    },
    date: '06/10/23',
    addedBy: 'Michele',
  },
  {
    version: '1.0.15',
    file: {
      name: '20230004',
      path: '',
    },
    date: '09/05/23',
    addedBy: 'John Lea',
  },
  {
    version: '1.0.16',
    file: {
      name: '20230005',
      path: '',
    },
    date: '11/18/23',
    addedBy: 'Guy Louis',
  },
  {
    version: '1.0.17',
    file: {
      name: '20230006',
      path: '',
    },
    date: '12/30/23',
    addedBy: 'Michele',
  },
  {
    version: '1.0.18',
    file: {
      name: '20230007',
      path: '',
    },
    date: '02/14/24',
    addedBy: 'John Lea',
  },
  {
    version: '1.0.19',
    file: {
      name: '20230008',
      path: '',
    },
    date: '04/01/24',
    addedBy: 'Guy Louis',
  },
  {
    version: '1.0.20',
    file: {
      name: '20230009',
      path: '',
    },
    date: '07/20/24',
    addedBy: 'Michele',
  },
]

const orderByData = {
  version: 'Numerical (version)',
  date: 'Added date',
}

const FirmwaresList = () => {
  const { showRightView } = useLayoutContext()

  const router = useRouter()
  const pathname = usePathname()

  const user = useUserContext()

  const [searchFilter, setSearchFilter] = useState('')

  const {
    items: filteredFirmwares,
    onOrderByChange,
    ascending,
    orderByColumn,
  } = useTableSort<Firmware>({
    items: fakeFirmwares,
    searchColumn: 'version',
    searchFilter,
    initialOrderByColumn: 'version',
  })

  const clearFilter = () => {
    setSearchFilter('')
  }

  return (
    <AdminLayoutList segment="firmwares">
      <div className="flex flex-col gap-6">
        {user.canEditKeycard && (
          <AddNewButton href="/admin/keycard/firmwares/new">
            New firmware
          </AddNewButton>
        )}
        <AdminLayoutList.Filters>
          <SearchInput
            placeholder="Find firmwares"
            value={searchFilter}
            onChange={setSearchFilter}
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
        segment="firmwares"
        itemsCount={filteredFirmwares.length}
        onClear={clearFilter}
      >
        <Table.Root>
          <Table.Header>
            <Table.HeaderCell>Version</Table.HeaderCell>
            <Table.HeaderCell>File</Table.HeaderCell>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Added by</Table.HeaderCell>
          </Table.Header>
          <Table.Body>
            {filteredFirmwares.map(firmware => {
              const firmwareRoute = `/admin/keycard/firmwares/${firmware.version}`
              return (
                <Table.Row
                  key={firmware.version}
                  aria-selected={pathname === firmwareRoute}
                  onClick={() => {
                    router.push(firmwareRoute)
                    showRightView()
                  }}
                >
                  <Table.Cell size={36}>{firmware.version}</Table.Cell>
                  <Table.Cell size={36}>
                    <div className="flex flex-row items-center gap-1">
                      <AttachIcon className="text-neutral-50" />
                      {firmware.file.name}
                    </div>
                  </Table.Cell>
                  <Table.Cell size={36}>{firmware.date}</Table.Cell>
                  <Table.Cell size={36}>
                    <div className="flex flex-row items-center gap-1">
                      <Avatar
                        type="user"
                        size="16"
                        name={firmware.addedBy}
                        // backgroundColor="$blue-50"
                      />
                      {firmware.addedBy}
                    </div>
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

export { FirmwaresList }
