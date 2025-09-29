import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from '@dnd-kit/modifiers'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DragIcon } from '@status-im/icons/20'

import { Table as RegularTable } from '~components/table'

import type { DragEndEvent } from '@dnd-kit/core'

type Props = {
  children: [
    React.ReactElement<typeof RegularTable.Header>,
    React.ReactElement<typeof RegularTable.Body>,
  ]
  items: number[]
  onSort: (from: number, to: number) => void
}

function Table(props: Props) {
  const { children, items, onSort } = props

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      onSort(active.id as number, over.id as number)
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  return (
    <DndContext
      id="table-body-sortable-context"
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <RegularTable.Root>{children}</RegularTable.Root>
      </SortableContext>
    </DndContext>
  )
}

type SortableItemProps = React.HTMLAttributes<HTMLTableRowElement> & {
  children: React.ReactElement<typeof RegularTable.Cell>[]
  sortId: number
  onClick: () => void
  disabled?: boolean
  isAdmin?: boolean
  name: string
}

function TableRow(props: SortableItemProps) {
  const { children, isAdmin, sortId, ...rest } = props

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,
  } = useSortable({
    id: sortId,
    transition: {
      duration: 500,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
    disabled: props.disabled,
  })

  return (
    <RegularTable.Row
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        userSelect: 'none',
      }}
      {...attributes}
      {...rest}
    >
      {isAdmin && (
        <RegularTable.Cell className="!px-0" size={36}>
          <div className="flex items-center gap-3">
            <div
              ref={setActivatorNodeRef}
              className="ml-2 w-5 cursor-grab transition-opacity aria-disabled:cursor-default aria-disabled:opacity-[20%]"
              aria-disabled={props.disabled}
              {...listeners}
            >
              <DragIcon />
            </div>
            <div className="whitespace-nowrap text-neutral-100">
              {props.name}
            </div>
          </div>
        </RegularTable.Cell>
      )}
      {children}
    </RegularTable.Row>
  )
}

Table.Header = RegularTable.Header
Table.Cell = RegularTable.Cell
Table.Row = TableRow
Table.Body = RegularTable.Body
Table.HeaderCell = RegularTable.HeaderCell
Table.Root = Table

export { Table as TableSortable }
