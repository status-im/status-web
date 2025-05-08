'use client'

import { cloneElement, type JSX, memo } from 'react'

import * as Popover from '@radix-ui/react-popover'
import { Input } from '@status-im/components'
import {
  ActivityIcon,
  FacesIcon,
  FlagsIcon,
  FoodIcon,
  NatureIcon,
  ObjectsIcon,
  PeopleIcon,
  RecentIcon,
  SearchIcon,
  SymbolsIcon,
  TravelIcon,
} from '@status-im/icons/20'
import { cva } from 'class-variance-authority'

import { EmojiButton } from './emoji-button'
import { EmojiTrigger } from './emoji-trigger'
import { useEmojiPicker } from './hooks/use-emoji-picker'

import type { Emoji } from './emoji-twitter'

// Type definitions
export type Category =
  | 'Frequently used'
  | 'Smileys & Emotion'
  | 'People & Body'
  | 'Flags'
  | 'Animals & Nature'
  | 'Food & Drink'
  | 'Activities'
  | 'Travel & Places'
  | 'Objects'
  | 'Symbols'

type CategoryIcons = {
  [key in Category]: JSX.Element
}

type Props = {
  children?: React.ReactNode
  onSelect: (emoji: Emoji) => void
  emoji?: Emoji
}

// Dynamic Styles
const gridContainerStyles = cva('grid grid-cols-8 gap-3 p-4 pt-0', {
  variants: {
    isRecentCategory: {
      true: 'border-b border-neutral-10',
      false: 'border-none',
    },
  },
})

const searchGridContainerStyles = cva('grid h-fit grid-cols-8 gap-3', {
  variants: {
    noResults: {
      true: 'p-0',
      false: 'p-4 pb-8',
    },
  },
})

const titleCategoryStyles = cva(
  'top-0 bg-blur-white/70 p-4 pb-3 text-13 font-medium text-neutral-50 backdrop-blur-[20px]',
  {
    variants: {
      isActive: {
        true: 'sticky -translate-y-0.5',
        false: 'static',
      },
    },
  }
)

// Unmutable data
const categoryOrder: Category[] = [
  'Frequently used',
  'Smileys & Emotion',
  'People & Body',
  'Flags',
  'Animals & Nature',
  'Food & Drink',
  'Activities',
  'Travel & Places',
  'Objects',
  'Symbols',
]

const CATEGORY_ICONS: CategoryIcons = {
  'Frequently used': <RecentIcon />,
  'Smileys & Emotion': <FacesIcon />,
  'People & Body': <PeopleIcon />,
  Flags: <FlagsIcon />,
  'Animals & Nature': <NatureIcon />,
  'Food & Drink': <FoodIcon />,
  Activities: <ActivityIcon />,
  'Travel & Places': <TravelIcon />,
  Objects: <ObjectsIcon />,
  Symbols: <SymbolsIcon />,
}

// Emoji Picker Component
const EmojiPicker = (props: Props) => {
  const { children, onSelect, emoji } = props

  const {
    isOpen,
    search,
    setSearch,
    activeCategory,
    indicatorStyle,
    categoryGridContainerRefs,
    titleCategoryRefs,
    scrollableContainerRef,
    categoryRefs,
    handleOpenChange,
    handleOnSelectEmoji,
    scrollToCategory,
    emojisResults,
    noResults,
    debouncedSearch,
    emojisListByCategory,
    recentEmojis,
  } = useEmojiPicker({
    onSelect,
  })

  return (
    <Popover.Root onOpenChange={open => handleOpenChange(open)} open={isOpen}>
      <Popover.Trigger asChild>
        {children || <EmojiTrigger selectedEmoji={emoji} />}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={12}
          align="start"
          alignOffset={16}
          collisionPadding={24}
          className="relative z-20 m-auto mb-0 max-h-[400px] w-[372px] overflow-hidden rounded-16 border border-neutral-10 bg-white-100 shadow-3 data-[state=closed]:animate-explanationOut data-[state=open]:animate-explanationIn"
        >
          {/* search input */}
          <div className="flex items-center justify-between border-b border-neutral-10 bg-white-100">
            <div className="flex w-full flex-col p-3">
              <Input
                placeholder="Find emojis"
                icon={<SearchIcon />}
                size="32"
                value={search}
                onChange={setSearch}
              />
            </div>
          </div>
          <div
            ref={scrollableContainerRef}
            className="relative h-[344px] overflow-auto scrollbar-none"
          >
            {/* Render each category and its emojis */}
            {debouncedSearch === '' ? (
              <div className="w-full">
                {categoryOrder.map(categoryName => {
                  const emojis = emojisListByCategory[categoryName] || []

                  const isRecentCategory = categoryName === 'Frequently used'
                  if (isRecentCategory && recentEmojis.length === 0) return null

                  const emojisToRender = isRecentCategory
                    ? recentEmojis
                    : emojis

                  return (
                    <div key={categoryName}>
                      <div
                        ref={el => {
                          titleCategoryRefs.current[categoryName] = el
                        }}
                        className={titleCategoryStyles({
                          isActive:
                            activeCategory === categoryName &&
                            !isRecentCategory,
                        })}
                      >
                        {categoryName}
                      </div>
                      <div
                        className={gridContainerStyles({ isRecentCategory })}
                        ref={el => {
                          categoryGridContainerRefs.current[categoryName] = el
                        }}
                      >
                        {emojisToRender.map(emoji => {
                          return (
                            <EmojiButton
                              key={emoji.char}
                              emoji={emoji}
                              onSelect={handleOnSelectEmoji}
                            />
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              // Render search results
              <div className="h-[287px] w-full">
                <div className={searchGridContainerStyles({ noResults })}>
                  {emojisResults
                    ?.sort((a, b) => a.sort_order - b.sort_order)
                    .map(emoji => (
                      <EmojiButton
                        key={emoji.char}
                        emoji={emoji}
                        onSelect={handleOnSelectEmoji}
                      />
                    ))}
                </div>
                {noResults && (
                  <div className="p-4 text-left text-13 font-medium text-neutral-50">
                    No results found
                  </div>
                )}
              </div>
            )}

            <div className="fixed bottom-0 z-10 flex w-[calc(100%-3px)] gap-0.5 overflow-hidden rounded-b-16 border-t border-t-neutral-10 bg-blur-white/70 px-4 py-3 text-neutral-100 backdrop-blur-[20px]">
              <div
                className="absolute left-0 size-8 rounded-8 bg-neutral-80/5 transition-all duration-300 ease-out"
                style={indicatorStyle}
              />

              {categoryOrder
                // Filter out the "Frequently used" category if there are no recent emojis
                .filter(
                  categoryName =>
                    categoryName !== 'Frequently used' ||
                    recentEmojis.length > 0
                )
                .map(categoryName => (
                  <button
                    ref={ref => {
                      categoryRefs.current[categoryName] = ref
                    }}
                    key={categoryName}
                    aria-label={categoryName}
                    data-category={categoryName}
                    onClick={() => {
                      scrollToCategory(categoryName)
                    }}
                    aria-disabled={debouncedSearch !== ''}
                    disabled={debouncedSearch !== ''}
                    className={`z-10 flex size-8 items-center justify-center rounded-6 transition-colors disabled:opacity-[50%] disabled:hover:bg-transparent`}
                  >
                    {cloneElement(CATEGORY_ICONS[categoryName], {
                      className: 'h-5 w-5',
                    })}
                  </button>
                ))}
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

// Memoize the component to avoid re-rendering on every parent re-render
const MemoizedEmojiPicker = memo(EmojiPicker)
export { MemoizedEmojiPicker as EmojiPicker }
