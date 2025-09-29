'use client'

import { useState } from 'react'

import { Button } from '@status-im/components'
import { ImportIcon } from '@status-im/icons/20'
import { usePathname, useRouter } from 'next/navigation'

import { AddNewButton } from '~admin/_components/add-new-button'
import { AdminDropdownSort } from '~admin/_components/dropdown-sort'
import { SearchInput } from '~admin/_components/search-input'
import { useLayoutContext } from '~admin/_contexts/layout-context'
import { useUserContext } from '~admin/_contexts/user-context'
import { useTableSort } from '~admin/_hooks/use-table-sort'
import { AdminLayoutList } from '~admin/_layouts/admin-layout-list'
import { Table } from '~components/table'

type Device = {
  uid: string
  imported: string
  verified: string
  verifications: number
}

const fakeDevices = [
  {
    uid: 'nrhmgn7quln0wv1j',
    imported: '22/12/23',
    verified: '23/12/23',
    verifications: 2,
  },
  {
    uid: '95bhdn449k91085q',
    imported: '21/12/23',
    verified: '25/12/23',
    verifications: 4,
  },
  {
    uid: 'oe9w9oxwd24gga7w',
    imported: '23/12/23',
    verified: '23/12/23',
    verifications: 3,
  },
  {
    uid: 's56k6oryxi1k002f',
    imported: '24/12/23',
    verified: '31/12/23',
    verifications: 1,
  },
  {
    uid: 'l9tni74b666fi9m323',
    imported: '25/12/23',
    verified: '',
    verifications: 0,
  },
  {
    uid: 'mthtgb7buln0vm2p23',
    imported: '28/12/23',
    verified: '29/12/23',
    verifications: 2,
  },
  {
    uid: 'b1h9zn4plk910fhx4234',
    imported: '27/12/23',
    verified: '27/12/23',
    verifications: 4,
  },
  {
    uid: 'jk9w8oxbt24gal4v14353',
    imported: '29/12/23',
    verified: '31/12/23',
    verifications: 3,
  },
  {
    uid: 'ebek6or6xi1k882e345',
    imported: '24/12/23',
    verified: '27/12/23',
    verifications: 1,
  },
  {
    uid: 'bo4mn74b66afi8n1345',
    imported: '25/12/23',
    verified: '',
    verifications: 0,
  },
  {
    uid: 'mthtgb7bu345ln0vm2p',
    imported: '28/12/23',
    verified: '29/12/23',
    verifications: 2,
  },
  {
    uid: 'b1h9zn4plk234910fhx',
    imported: '27/12/23',
    verified: '27/12/23',
    verifications: 4,
  },
  {
    uid: 'jk9w8ox2342bt24gal4v2',
    imported: '29/12/23',
    verified: '31/12/23',
    verifications: 3,
  },
  {
    uid: 'ebek6354or6xi1k882e',
    imported: '24/12/23',
    verified: '27/12/23',
    verifications: 1,
  },
  {
    uid: 'bo4mn74b66234afi8n1',
    imported: '25/12/23',
    verified: '',
    verifications: 0,
  },
  {
    uid: 'mthtgb7235buln0vm2p',
    imported: '28/12/23',
    verified: '29/12/23',
    verifications: 2,
  },
  {
    uid: 'b1h9zn4p2352lk910fhx',
    imported: '27/12/23',
    verified: '27/12/23',
    verifications: 4,
  },
  {
    uid: 'jk9w8o2352xbt24gal4v3',
    imported: '29/12/23',
    verified: '31/12/23',
    verifications: 3,
  },
  {
    uid: 'ebek6o235r6xi1k882e',
    imported: '24/12/23',
    verified: '27/12/23',
    verifications: 1,
  },
  {
    uid: 'bo4mn74b234266afi8n1',
    imported: '25/12/23',
    verified: '',
    verifications: 0,
  },
  {
    uid: 'mthtgb7b456uln0vm2p',
    imported: '28/12/23',
    verified: '29/12/23',
    verifications: 2,
  },
  {
    uid: 'b1h9zn48765plk910fhx',
    imported: '27/12/23',
    verified: '27/12/23',
    verifications: 4,
  },
  {
    uid: 'jk9w8oxbt7424gal4v',
    imported: '29/12/23',
    verified: '31/12/23',
    verifications: 3,
  },
  {
    uid: 'ebek6or3576xi1k882e',
    imported: '24/12/23',
    verified: '27/12/23',
    verifications: 1,
  },
  {
    uid: 'bo4mn74357b66afi8n1',
    imported: '25/12/23',
    verified: '',
    verifications: 0,
  },
]

const orderByData = {
  uid: 'Alphabetical',
  imported: 'Imported date',
  verified: 'First verified date',
}

const DevicesList = () => {
  const router = useRouter()
  const pathname = usePathname()

  const user = useUserContext()

  const { showRightView } = useLayoutContext()

  const [searchFilter, setSearchFilter] = useState<string>('')

  const {
    items: sortedDevices,
    onOrderByChange,
    orderByColumn,
    ascending,
  } = useTableSort<Device>({
    items: fakeDevices,
    searchColumn: 'uid',
    searchFilter,
    initialOrderByColumn: 'uid',
  })

  const clearSearch = () => {
    setSearchFilter('')
  }

  return (
    <AdminLayoutList
      segment="devices"
      action={
        user.canEditKeycard && (
          <Button
            variant="outline"
            size="32"
            onPress={() => console.log('import csv')}
            iconBefore={<ImportIcon />}
          >
            Import CSV
          </Button>
        )
      }
    >
      <div className="flex flex-col gap-6">
        {user.canEditKeycard && (
          <AddNewButton href="/admin/keycard/devices/new">
            New device
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
        segment="devices"
        itemsCount={sortedDevices.length}
        onClear={clearSearch}
      >
        <Table.Root>
          <Table.Header>
            <Table.HeaderCell minWidth={140}>UID</Table.HeaderCell>
            <Table.HeaderCell>Imported</Table.HeaderCell>
            <Table.HeaderCell>First verified</Table.HeaderCell>
            <Table.HeaderCell>Verifications</Table.HeaderCell>
          </Table.Header>
          <Table.Body>
            {sortedDevices.map(device => {
              const deviceRoute = `/admin/keycard/devices/${device.uid}`
              return (
                <Table.Row
                  key={device.uid}
                  aria-selected={pathname === deviceRoute}
                  onClick={() => {
                    router.push(deviceRoute)
                    showRightView()
                  }}
                >
                  <Table.Cell size={36}>{device.uid}</Table.Cell>
                  <Table.Cell size={36}>{device.imported}</Table.Cell>
                  <Table.Cell size={36}>{device.verified}</Table.Cell>
                  <Table.Cell size={36}>{device.verifications}</Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table.Root>
      </AdminLayoutList.TableResults>
    </AdminLayoutList>
  )
}

export { DevicesList }
