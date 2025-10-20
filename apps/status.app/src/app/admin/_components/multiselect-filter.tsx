'use client'

import { DropdownButton, DropdownMenu } from '@status-im/components'

type MultiselectOption = {
  id: string
  label: string
  icon?: JSX.Element
}

type MultiselectFilterProps = {
  label: string
  options: MultiselectOption[]
  selection: string[]
  onSelectionChange: (options: string[]) => void
}

const MultiselectFilter = (props: MultiselectFilterProps) => {
  const { label, options, selection, onSelectionChange } = props

  const onSelect = (optionId: string) => {
    const newSelectedOptions = selection.includes(optionId)
      ? selection.filter(id => id !== optionId)
      : [...selection, optionId]

    onSelectionChange(newSelectedOptions)
  }

  return (
    <DropdownMenu.Root>
      <DropdownButton variant="outline" size="32">
        {label}
      </DropdownButton>
      <DropdownMenu.Content className="!w-[188px]">
        {options.map(option => (
          <DropdownMenu.CheckboxItem
            key={option.id}
            label={option.label}
            onCheckedChange={() => onSelect(option.id)}
            checked={selection.includes(option.id)}
            onSelect={e => e.preventDefault()}
            {...(option.icon && { icon: option.icon })}
          />
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export { MultiselectFilter }
export type { MultiselectOption }
