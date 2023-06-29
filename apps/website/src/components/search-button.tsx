import { Shortcut, Text } from '@status-im/components'
import { CommandIcon, SearchIcon } from '@status-im/icons'
import { cva } from 'class-variance-authority'

import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'

import type { VariantProps } from 'class-variance-authority'

type Props = {
  size: NonNullable<VariantProps<typeof styles>['size']>
}

export const SearchButton = (props: Props) => {
  useKeyboardShortcuts({
    '$mod+K': () => {
      console.log('search')
    },
  })

  return (
    <button
      className={styles(props)}
      onClick={() => {
        console.log('search')
      }}
    >
      <span className="flex items-center gap-1">
        <SearchIcon size={20} color="$neutral-50" />
        <Text size={15} weight="medium">
          Search
        </Text>
      </span>

      <span className="flex gap-[2px]">
        <Shortcut variant="secondary" icon={CommandIcon} />
        <Shortcut variant="secondary" symbol="K" />
      </span>
    </button>
  )
}

const styles = cva(
  'inline-flex items-center rounded-xl border border-neutral-20 shadow-1',
  {
    variants: {
      size: {
        38: 'h-[38px] gap-4 px-4',
        32: 'h-[32px] gap-2 px-2',
      },
    },
  }
)
