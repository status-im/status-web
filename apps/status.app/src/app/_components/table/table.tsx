'use client'

import { forwardRef } from 'react'

import { Popover } from '@status-im/components'
import { cva } from 'class-variance-authority'

import { useMediaQuery } from '~hooks/use-media-query'
import { Tag } from '~website/insights/_components/table-issues/tag'

import type React from 'react'

type TableRootProps = {
  children: [
    React.ReactElement<typeof TableHeader>,
    React.ReactElement<typeof TableBody>,
  ]
}

const TableRoot = (props: TableRootProps) => {
  const { children } = props

  return (
    <div className="min-w-full overflow-x-auto rounded-16 border border-neutral-20 scrollbar-none">
      <table className="min-w-full border-separate border-spacing-0">
        {children}
      </table>
    </div>
  )
}

type TableHeadRowProps = {
  children: React.ReactElement<typeof TableHeaderCell>[]
}

const TableHeader = (props: TableHeadRowProps) => {
  const { children } = props

  return (
    <thead className="relative before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-neutral-20">
      <tr className="bg-neutral-2.5">
        <th className="w-1"></th>
        {children}
        <th className="w-1"></th>
      </tr>
    </thead>
  )
}

type TableHeaderCellProps = {
  children: React.ReactNode
  wrap?: boolean
  minWidth?: number
  className?: string
} & React.HTMLAttributes<HTMLTableCellElement>

const TableHeaderCell = (props: TableHeaderCellProps) => {
  const { children, wrap, minWidth, className, ...rest } = props

  const tableHeaderCellStyles = cva(
    ['p-3 text-left text-13 font-medium text-neutral-50'],

    {
      variants: {
        wrap: {
          true: ['whitespace-normal'],
          false: ['whitespace-nowrap'],
        },
      },
    }
  )

  return (
    <th
      style={{
        minWidth,
      }}
      className={tableHeaderCellStyles({ wrap, className })}
      {...rest}
    >
      {children}
    </th>
  )
}

type TableBodyProps = {
  children: React.ReactNode
}

const TableBody = (props: TableBodyProps) => {
  const { children } = props

  return (
    <tbody>
      <tr className="h-1" />
      {children}
      <tr className="h-1" />
    </tbody>
  )
}

type TableRowProps = {
  children: React.ReactNode
  onClick?: () => void
} & React.HTMLAttributes<HTMLTableRowElement>

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  (props, ref) => {
    const { children, onClick, ...rest } = props

    return (
      <>
        <tr className="h-0.5" />
        <tr
          ref={ref}
          onClick={onClick}
          className="transition-colors active:bg-customisation-blue-50/5 aria-selected:bg-customisation-blue-50/5 hover:cursor-pointer hover:bg-neutral-5 [&>*:not(:first-child):not(:last-child)]:border-y [&>*:nth-last-of-type(2)]:rounded-r-12 [&>*:nth-last-of-type(2)]:border-r [&>*:nth-of-type(2)]:rounded-l-12 [&>*:nth-of-type(2)]:border-l [&>*]:border-transparent [&>*]:aria-selected:border-customisation-blue-50/20"
          {...rest}
        >
          <td className="bg-white-100"></td>
          {children}
          <td className="bg-white-100"></td>
        </tr>
      </>
    )
  }
)

TableRow.displayName = 'TableRow'

type TableCellProps = {
  children: React.ReactNode
  className?: string
  size?: 36 | 48
} & React.HTMLAttributes<HTMLTableCellElement>

const tableCellStyles = cva(
  'whitespace-nowrap px-3 text-13 font-medium text-neutral-100',
  {
    variants: {
      size: {
        36: ['h-9'],
        48: ['h-12'],
      },
    },
  }
)

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  (props, ref) => {
    const { children, className, size = 48, ...rest } = props

    return (
      <td ref={ref} className={tableCellStyles({ size, className })} {...rest}>
        {children}
      </td>
    )
  }
)

TableCell.displayName = 'TableCell'

type TagItem = {
  id: number
  name: string
  color: string
}

type TableTagsProps = {
  tags: TagItem[]
  numberOfTags?: number
}

const TableTags = (props: TableTagsProps) => {
  const matches4XL = useMediaQuery('4xl')
  const defaultNumberOfTags = matches4XL ? 2 : 1
  const { tags, numberOfTags: numberOfTagsProp } = props

  const numberOfTags = numberOfTagsProp || defaultNumberOfTags

  return (
    <div className="flex gap-1">
      {tags
        .map((tag: TagItem) => {
          const { id, name, color } = tag
          const isInternal = name.startsWith('E:')

          return (
            <Tag
              {...(isInternal && {
                variant: 'internal',
              })}
              key={id}
              label={name}
              color={color}
            />
          )
        })
        .slice(0, numberOfTags)}

      {tags.length > numberOfTags && (
        <Popover.Root>
          <button
            onClick={e => e.stopPropagation()}
            className="flex h-6 items-center rounded-[24px] border border-neutral-20 px-2 text-neutral-50 transition-all duration-200 active:border-neutral-40 data-[state=open]:border-neutral-40 data-[state=open]:bg-neutral-10 hover:border-neutral-30 hover:bg-neutral-10"
          >
            +{tags.length - numberOfTags}
          </button>

          <Popover.Content align="end" alignOffset={0} sideOffset={8}>
            <div className="hidden max-w-sm flex-wrap gap-1 whitespace-nowrap p-2 2md:flex">
              {tags
                .map((tag: TagItem) => {
                  const { id, name, color } = tag
                  const isInternal = name.startsWith('E:')

                  return (
                    <Tag
                      {...(isInternal && {
                        variant: 'internal',
                      })}
                      key={id}
                      label={name}
                      color={color}
                    />
                  )
                })
                .slice(numberOfTags)}
            </div>
          </Popover.Content>
        </Popover.Root>
      )}
    </div>
  )
}

export const Root = TableRoot
export const Header = TableHeader
export const Cell = TableCell
export const Row = TableRow
export const Body = TableBody
export const HeaderCell = TableHeaderCell
export const Tags = TableTags
