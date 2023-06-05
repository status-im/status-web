import { useState } from 'react'

import { Avatar, Button, Input, Text } from '@status-im/components'
import { DropdownMenu } from '@status-im/components/src/dropdown-menu'
import { DropdownIcon, SearchIcon } from '@status-im/icons'

type Props = {
  authors: {
    id: number
    name: string
    avatar?: string
  }[]
}
const FilterAuthor = (props: Props) => {
  const { authors } = props

  const [authorFilterText, setAuthorFilterText] = useState('')
  const filteredAuthors = authors.filter(author =>
    author.name.toLowerCase().includes(authorFilterText.toLowerCase())
  )

  const [selectedAuthors, setSelectedAuthors] = useState<number[]>([])

  return (
    <div className="pr-3">
      <DropdownMenu>
        <Button
          size={32}
          variant="outline"
          iconAfter={<DropdownIcon size={20} />}
        >
          Author
        </Button>
        <DropdownMenu.Content sideOffset={10} align="end">
          <div className="p-2 px-1">
            <Input
              placeholder="Find Author"
              icon={<SearchIcon size={20} />}
              size={32}
              value={authorFilterText}
              onChangeText={setAuthorFilterText}
            />
          </div>
          {filteredAuthors.map(author => (
            <DropdownMenu.CheckboxItem
              key={author.id}
              icon={
                <Avatar
                  name={author.name}
                  src={author.avatar}
                  size={16}
                  type="user"
                />
              }
              label={author.name}
              checked={selectedAuthors.includes(author.id)}
              onSelect={() => {
                if (selectedAuthors.includes(author.id)) {
                  setSelectedAuthors(
                    selectedAuthors.filter(id => id !== author.id)
                  )
                } else {
                  setSelectedAuthors([...selectedAuthors, author.id])
                }
              }}
            />
          ))}
          {filteredAuthors.length === 0 && (
            <div className="p-2 py-1">
              <Text size={13}> No authors found</Text>
            </div>
          )}
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  )
}

export { FilterAuthor }
