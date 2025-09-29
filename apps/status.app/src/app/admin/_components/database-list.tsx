'use client'

import { Avatar, Button } from '@status-im/components'
import { DownloadIcon } from '@status-im/icons/12'
import { ExternalIcon } from '@status-im/icons/16'
import { cx } from 'class-variance-authority'

import { Link } from '~components/link'

type DatabaseItem = {
  id: string
  name: string
  erc20url: string
  chainUrl: string
  date: string
  file?: {
    url: string
    name: string
  }
  addedBy: string
}

type Props = {
  children: React.ReactNode
} & React.HTMLAttributes<HTMLUListElement>

const DatabaseList = (props: Props) => {
  const { children, ...rest } = props

  return (
    <ul {...rest} className="flex flex-col gap-2">
      {children}
    </ul>
  )
}

type DatabaseListItemProps = {
  item: DatabaseItem
  onClick?: () => void
  children?: React.ReactNode
} & React.HTMLAttributes<HTMLLIElement>

const DatabaseListItem = (props: DatabaseListItemProps) => {
  const { item, children, onClick, ...rest } = props

  return (
    <li
      {...rest}
      role="menuitem"
      onClick={onClick}
      onKeyDown={onClick}
      className={cx(
        'flex flex-col rounded-16 border border-solid border-neutral-10 p-1',
        'hover:border-neutral-10 hover:bg-neutral-5',
        'aria-selected:border-customisation-blue-50/20 aria-selected:bg-customisation-blue-50/5'
      )}
    >
      <div className="flex flex-row items-center justify-between px-3 py-2">
        <span className="text-13 font-medium text-neutral-100">
          {item.name}
        </span>
        {item.file && (
          <Button
            variant="outline"
            size="24"
            onPress={() => console.log('download db', item.file?.url)}
            iconAfter={<DownloadIcon />}
          >
            Download
          </Button>
        )}
      </div>
      {children && (
        <div className="flex flex-col gap-1 px-3 pb-2 pt-0">{children}</div>
      )}
    </li>
  )
}

type DatabaseListItemRowProps = {
  label: string
  value: string
  type: 'link' | 'text' | 'user'
}

const DatabaseListItemRow = (props: DatabaseListItemRowProps) => {
  const { label, value, type } = props

  return (
    <div className="flex flex-row gap-4">
      <span className="w-[80px] text-13 font-medium text-neutral-50">
        {label}
      </span>
      {renderListItemRowType({ type, value })}
    </div>
  )
}

type DatabaseListItemRowType = {
  type: DatabaseListItemRowProps['type']
  value: DatabaseListItemRowProps['value']
}

const renderListItemRowType = (props: DatabaseListItemRowType) => {
  const { type, value } = props

  switch (type) {
    case 'link':
      return (
        <Link
          className="group text-13 font-medium text-neutral-100"
          href={value}
          onClick={e => e.stopPropagation()}
        >
          {value}
          <ExternalIcon className="inline-block transition-transform group-hover:translate-x-[2px] group-hover:translate-y-[-2px]" />
        </Link>
      )
    case 'user':
      return (
        <span className="flex flex-row items-center gap-1 text-13 font-medium text-neutral-100">
          <Avatar
            size="20"
            // backgroundColor="$blue-50"
            type="user"
            name={value}
          />
          {value}
        </span>
      )
    default:
      return (
        <span className="text-13 font-medium text-neutral-100">{value}</span>
      )
  }
}

DatabaseList.Root = DatabaseList
DatabaseList.Item = DatabaseListItem
DatabaseList.ItemRow = DatabaseListItemRow

export { DatabaseList }
