import { IconButton } from '@status-im/components'
import { ClearIcon, SearchIcon } from '@status-im/icons/20'

type SearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder: string
}

const SearchInput = (props: SearchInputProps) => {
  const { onChange, value, placeholder } = props
  return (
    <div className="flex grow items-stretch">
      <label className="relative w-full">
        <SearchIcon className="absolute left-2 top-[6px] text-neutral-40" />
        <input
          placeholder={placeholder}
          size={32}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="h-8 w-full rounded-12 border border-solid border-neutral-20 px-2 py-1 pl-8 text-15 font-regular placeholder:font-regular aria-selected:border-neutral-40 focus:border-neutral-40"
        />
        {value.length > 0 && (
          <span className="absolute right-0 top-0">
            <IconButton
              icon={<ClearIcon className="text-neutral-40" />}
              onPress={() => onChange('')}
              variant="ghost"
            />
          </span>
        )}
      </label>
    </div>
  )
}

export { SearchInput }
