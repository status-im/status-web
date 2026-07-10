import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react'

import { renderText } from '~app/_utils/render-text'

type ContentElement = ReactElement<{ children?: ReactNode }>

const toElementArray = (children: ReactNode): ContentElement[] =>
  Children.toArray(children).filter((child): child is ContentElement =>
    isValidElement<{ children?: ReactNode }>(child)
  )

const isHtmlElement = (element: ContentElement, tagName: string) =>
  element.type === tagName

const getTableRows = (element?: ContentElement) => {
  if (!element) {
    return []
  }

  return toElementArray(element.props.children).filter(row =>
    isHtmlElement(row, 'tr')
  )
}

const getTableCells = (row: ContentElement) =>
  toElementArray(row.props.children).filter(
    cell => isHtmlElement(cell, 'td') || isHtmlElement(cell, 'th')
  )

export function Table(props: {
  hasShadow?: boolean
  children: React.ReactNode
}) {
  const { hasShadow = false, children } = props

  const table = (
    <table className="min-w-full group-[.group]:max-w-[calc(540px-2rem)]">
      {children}
    </table>
  )

  const tableFrame = (
    <div className="w-full overflow-hidden rounded-12 border border-neutral-20">
      <div className="overflow-x-auto">{table}</div>
    </div>
  )

  return (
    <div className="w-full max-[542px]:pb-4">
      {hasShadow ? (
        <div className="inline-block min-w-full rounded-12 align-top shadow-1">
          {tableFrame}
        </div>
      ) : (
        tableFrame
      )}
    </div>
  )
}

export function TableHead(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <thead>
      <tr className="border-b border-neutral-10 bg-neutral-5">{children}</tr>
    </thead>
  )
}

export function TableContent(props: { children: React.ReactNode }) {
  const { children } = props

  return <tbody>{children}</tbody>
}

export function TableRow(props: { children: React.ReactNode }) {
  const { children } = props

  return <tr>{children}</tr>
}

export function TableHeader(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <th className="whitespace-nowrap p-3 text-left">
      {renderText({
        children,
        size: 'text-15',
        weight: 'font-medium',
        color: 'text-neutral-50',
      })}
    </th>
  )
}

export function TableCell(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <td className="p-3 align-top">
      {renderText({ children, size: 'text-15' })}
    </td>
  )
}

// Handles tables missing a <thead> (older Ghost tables) or otherwise not
// shaped as exactly [thead, tbody], instead of assuming that fixed shape.
export function renderContentTable(children: ReactNode) {
  const elements = toElementArray(children)
  const head = elements.find(child => isHtmlElement(child, 'thead'))
  const bodies = elements.filter(child => isHtmlElement(child, 'tbody'))
  const directRows = elements.filter(child => isHtmlElement(child, 'tr'))
  const footer = elements.find(child => isHtmlElement(child, 'tfoot'))
  const headerRows = getTableRows(head)
  const headerCells = headerRows[0] ? getTableCells(headerRows[0]) : []
  const bodyRows = [
    ...headerRows.slice(1),
    ...bodies.flatMap(getTableRows),
    ...directRows,
    ...getTableRows(footer),
  ]

  return (
    <Table>
      {headerCells.length > 0 && (
        <TableHead>
          {headerCells.map((header, index) => (
            <TableHeader key={index}>{header.props.children}</TableHeader>
          ))}
        </TableHead>
      )}
      <TableContent>
        {bodyRows.map((row, index) => (
          <TableRow key={index}>
            {getTableCells(row).map((cell, index) =>
              // A <th> in a body row is a row header (common in tables with
              // no <thead>); rendering it as a <td> would drop that
              // semantic and its header styling.
              isHtmlElement(cell, 'th') ? (
                <TableHeader key={index}>{cell.props.children}</TableHeader>
              ) : (
                <TableCell key={index}>{cell.props.children}</TableCell>
              )
            )}
          </TableRow>
        ))}
      </TableContent>
    </Table>
  )
}
