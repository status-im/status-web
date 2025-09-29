import { renderText } from '~app/_utils/render-text'

export function Table(props: {
  hasShadow?: boolean
  children: [
    React.ReactElement<typeof TableHead>,
    React.ReactElement<typeof TableContent>,
  ]
}) {
  const { hasShadow = false, children } = props

  const table = (
    <div className="w-min overflow-hidden rounded-12 border border-neutral-20">
      <table className="w-[540px] group-[.group]:max-w-[calc(540px-2rem)]">
        {children}
      </table>
    </div>
  )

  return (
    <div className="overflow-x-auto">
      <div className="w-fit max-[542px]:pb-4 max-[542px]:pr-12">
        {hasShadow ? (
          <div className="w-min rounded-12 shadow-1">{table}</div>
        ) : (
          table
        )}
      </div>
    </div>
  )
}

export function TableHead(props: {
  children: React.ReactElement<typeof TableCell>[]
}) {
  const { children } = props

  return (
    <thead>
      <tr className="border-b border-neutral-10 bg-neutral-5">{children}</tr>
    </thead>
  )
}

export function TableContent(props: {
  children: React.ReactElement<typeof TableRow>[]
}) {
  const { children } = props

  return <tbody>{children}</tbody>
}

export function TableRow(props: {
  children: React.ReactElement<typeof TableCell>
}) {
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
