import { Skeleton } from '@status-im/components'

import * as Table from '../table'

const AssetsListLoading = () => {
  return (
    <div
      aria-busy="true"
      aria-label="Loading tokens"
      className="min-h-[calc(100svh-362px)]"
    >
      <Table.Root>
        <Table.Header>
          <Table.HeaderCell>Tokens</Table.HeaderCell>
          <Table.HeaderCell>Price</Table.HeaderCell>
          <Table.HeaderCell>24H%</Table.HeaderCell>
          <Table.HeaderCell>Balance</Table.HeaderCell>
          <Table.HeaderCell>Value</Table.HeaderCell>
        </Table.Header>
        <Table.Body>
          {Array.from({ length: 12 }).map((_, index) => {
            return (
              <Table.Row key={index} className="pointer-events-none">
                <Table.Cell size={36}>
                  <div className="flex items-center gap-2">
                    <Skeleton height={24} width={24} className="rounded-full" />
                    <Skeleton
                      height={10}
                      width={120}
                      className="rounded-10"
                      variant="secondary"
                    />
                  </div>
                </Table.Cell>
                <Table.Cell size={36}>
                  <Skeleton
                    height={10}
                    width={56}
                    className="rounded-10"
                    variant="secondary"
                  />
                </Table.Cell>
                <Table.Cell size={36}>
                  <Skeleton
                    height={10}
                    width={56}
                    className="rounded-6"
                    variant="secondary"
                  />
                </Table.Cell>
                <Table.Cell size={36}>
                  <Skeleton
                    height={10}
                    width={56}
                    className="rounded-6"
                    variant="secondary"
                  />
                </Table.Cell>
                <Table.Cell size={36}>
                  <Skeleton
                    height={10}
                    width={56}
                    className="rounded-6"
                    variant="secondary"
                  />
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table.Root>
    </div>
  )
}

export { AssetsListLoading }
